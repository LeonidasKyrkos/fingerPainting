let io = require('../../configureServer').io;
let firebase = require('../modules/firebaseConfig');
let room = require('../modules/room');

function Game(socket,gameId,database) {
	this.id = gameId;
	this.sockets = {};
	this.database = database;
	this.roomRef = firebase.db.ref(firebase.roomsPath + this.id);
	this.gameLength = 90;

	firebase.db.ref('/dictionary').on('value',(snapshot)=>{
		this.dictionary = [];
		this.dictionaryObj = snapshot.val();
		for(word in this.dictionaryObj) {
			this.dictionary.push(word);
		}

		firebase.db.ref('/dictionary').off();
		this.init(socket);
	});
}

Game.prototype = {
	init: function(socket) {
		this.store = {};
		this.roundCount = 1;
		this.attachListeners(socket);
		this.attachFirebase();
		this.resetGame();
	},

	attachFirebase() {
		this.database.on('value',this.updateStore.bind(this));
	},

	attachListeners(socket) {
		this.sockets[socket.userId] = socket;

		// join room and add to db
		room.handler(this.id,socket);

		socket.on('path update',(path)=>{
			let ref = this.roomRef.child('/paths/');
			ref.set(path);
		});

		socket.on('start round',this.startRound.bind(this));
		socket.on('pause round',this.pauseRound.bind(this));
		socket.on('unpause round',this.unpauseRound.bind(this));
		socket.on('message',this.parseMessage.bind(this));
		socket.on('disconnect',this.handleDisconnect.bind(this,socket));
	},

	handleDisconnect(socket) {
		let users = this.store.users || {};
		let user = users[socket.conn.id] || {};
		if(users && user && user.status === 'captain') {
			this.endRound();
		}

		for(let object in this.sockets) {
			if(socket.id === this.sockets[object].id) {
				delete this.sockets[object];
			}
		}

		this.removeUserFromGame(socket.conn.id);
	},

	removeUserFromGame(user) {
		this.roomRef.child('users').child(user).remove();
	},

	updateStore: function(snapshot) {
		this.store = snapshot.val();
		this.store.currentRoom = '/rooms/' + this.id;
		io.emit('store update',this.store);
	},

	startRound: function() {
		this.getPuzzle();
		this.startInterval();
		this.roomRef.update({
			status: 'playing'
		})
	},

	startInterval: function() {
		this.interval = setInterval(this.countdown.bind(this),1000);
	},

	pauseRound: function() {
		clearInterval(this.interval);
		this.roomRef.update({
			status: 'paused'
		})
	},

	unpauseRound: function() {
		this.startInterval();
		this.roomRef.update({
			status: 'playing'
		})
	},

	getPuzzle: function() {
		let max = this.dictionary.length - 1;
		let min = 1;		
		let random = Math.floor(Math.random() * (max - min)) + min;
		this.puzzle = this.dictionary[random];
		let puzzleIndex = this.dictionary.indexOf(this.puzzle);
		this.dictionary.splice(puzzleIndex,1);

		this.informTheCaptain(this.puzzle);
	},

	informTheCaptain(puzzle) {
		for(user in this.store.users) {
			if(this.store.users[user].status === 'captain') {
				this.sockets[user].emit('puzzle',puzzle)
			}
		}
	},

	parseMessage(message) {
		if(message.message === this.puzzle) {
			this.cleverSailor(message);			
		} else {
			let ref = this.roomRef.child('/chatLog/').push(message);
		}
	},

	cleverSailor: function(message) {
		let newScore = this.calculatePoints(message.id);

		this.roomRef.child('/users/').child(message.id).update({ correct: true, score: newScore } );
		this.cleverSailors++;

		if(this.cleverSailors >= Object.keys(this.store.users).length - 1) {
			this.endRound();
		}
	},

	calculatePoints: function(id) {
		let currentScore = this.store.users[id].score || 0;
		let newScore = currentScore + this.timer;
		return newScore;
	},
	
	countdown: function() {
		if(this.timer < 1) {
			this.endRound();
		} else {
			this.timer--;
			this.roomRef.update({
				clock: this.timer
			})
		}
	},

	endRound: function() {
		clearInterval(this.interval);
		usersArr = Object.keys(this.store.users) || [];

		if(this.roundCount >= usersArr.length * 2) {
			this.endGame();
		} else {
			if(usersArr.length <= 1) {
				this.resetRoom();				
			} else {
				this.newRound();
			}
		}		
	},

	newRound: function() {
		this.roundCount++;
		this.resetGame();
		this.newCaptain();
		this.startRound();
	},

	newCaptain: function() {
		let users = this.store.users;
		let usersArr = Object.keys(users) || [];

		for(let i = 0; i < usersArr.length; i++) {
			let username = usersArr[i];
			let user = users[username];

			if(user.status === 'captain') {
				this.setSailor(username);

				if(i === usersArr.length - 1) {
					var nextUsername = usersArr[0];
				} else {
					var nextUsername = usersArr[i+1];
				}

				this.setCaptain(nextUsername);	

				break;
			}
		}
	},

	setSailor: function(username) {
		this.roomRef.child('users').child(username).update({
			status: 'sailor'
		})
	},

	setCaptain: function(username) {
		this.roomRef.child('users').child(username).update({
			status: 'captain'
		})
	},

	endGame: function() {
		this.roomRef.update({
			status: 'finished'
		})

		setTimeout(()=>{
			this.resetRoom();
		},10000);
	},

	resetGame: function() {
		this.roomRef.update({
			status: 'pending'
		});

		this.roomRef.child('paths').remove();
		this.cleverSailors = 0;
		this.resetClock();
		this.resetCorrectStatus();		

		io.emit('puzzle','');
	},

	resetCorrectStatus: function() {
		if(this.store.users) {
			let users = this.store.users;
			let usersArr = Object.keys(users) || [];

			for(let i = 0; i < usersArr.length; i++) {
				let username = usersArr[i];
				let user = users[username];

				this.roomRef.child('users').child(username).update({
					correct: false
				})
			}
		}
	},

	resetClock: function() {
		this.timer = this.gameLength;
		this.roomRef.update({
			clock: this.timer
		})
	},

	resetRoom: function() {
		this.resetGame();
		this.resetUsers();
		this.roundCount = 1;
	},

	resetUsers: function() {
		let users = this.store.users;
		
		for(let user in users) {
			this.roomRef.child('users').child(user).update({
				correct: false,
				score: 0
			})
		}
	}
}

module.exports = Game;