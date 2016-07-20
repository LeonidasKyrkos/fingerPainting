var io = require('../../configureServer').io;
var firebase = require('../modules/firebaseConfig');
var room = require('../modules/room');

function Game(socket,gameId,database) {
	this.id = gameId;
	this.sockets = [];
	this.database = database;
	this.init(socket);
}

Game.prototype = {
	init: function(socket) {
		this.store = {};

		this.attachListeners(socket);
		this.attachFirebase();
		//this.startRound();
	},

	attachFirebase() {
		this.database.on('value',this.updateStore.bind(this));
	},

	attachListeners(socket) {
		this.sockets.push(socket);

		// join room and add to db
		room.handler(this.id,socket);

		socket.on('path update',(path)=>{
			var ref = firebase.db.ref(firebase.roomsPath + this.id + '/paths/');
			ref.set(path);
		});

		socket.on('start round',this.startRound.bind(this));
		socket.on('pause round',this.pauseRound.bind(this));
		socket.on('continue round',this.unpauseRound.bind(this));
		socket.on('message',this.parseMessage.bind(this));
		socket.on('disconnect',()=>{
			for(var i = 0; i < this.sockets.length; i++) {
				
				if(socket.id === this.sockets[i].id) {
					this.sockets.splice(i, 1);
				}
			}
		});
	},

	parseMessage(message) {
		var ref = firebase.db.ref(firebase.roomsPath + this.id + '/chatLog/');
		ref.push(message);
	},

	updateStore: function(snapshot) {
		this.store = snapshot.val();
		this.store.currentRoom = '/rooms/' + this.id;

		if(this.store.users && this.sockets.length && Object.keys(this.store.users).length === 1) {
			let user = {
				id: this.sockets[0].username, 
				name: this.sockets[0].name, 
				captain: true
			};
			this.sockets[0].emit('user update',user);
		}

		io.emit('store update',this.store);
	},

	startRound: function() {
		this.timer = 10;
		this.startInterval();
	},

	startInterval: function() {
		this.interval = setInterval(this.countdown.bind(this),1000);
	},

	pauseRound: function() {
		clearInterval(this.interval);
		console.log('paused');
	},

	unpauseRound: function() {
		this.startInterval();
		console.log('playing');
	},

	countdown: function() {
		if(this.timer <= 1) {
			this.endRound();
		} else {
			this.timer--;
			io.emit('countdown',this.timer);
		}
	},

	endRound: function() {
		clearInterval(this.interval);
		io.emit('round end');
	}
}

module.exports = Game;