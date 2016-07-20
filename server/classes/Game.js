var io = require('../../configureServer').io;
var firebase = require('../modules/firebaseConfig');

function Game(socket) {
	this.socket = socket;
	this.init();
}

Game.prototype = {
	init: function() {
		this.store = {};

		this.attachFirebase();
		this.attachListeners();
		//this.startRound();
	},

	attachFirebase() {
		this.socket.database.on('value',this.updateStore.bind(this));
	},

	attachListeners() {
		this.socket.on('start round',this.startRound.bind(this));
		this.socket.on('pause round',this.pauseRound.bind(this));
		this.socket.on('continue round',this.unpauseRound.bind(this));
	},

	updateStore: function(snapshot) {
		this.store = snapshot.val();
		io.emit('storeUpdate',this.store);
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