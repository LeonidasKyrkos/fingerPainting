let io = require('../../configureServer').io;
let firebase = require('../modules/firebaseConfig');
let room = require('../modules/room');

function Game(socket,gameId,database) {
	this.id = gameId;
	this.sockets = {};
	this.database = database;
	this.gameLength = 10;

	this.database.child('dictionary').on('value',(snapshot)=>{
		let dictionary = snapshot.val();
		this.getDictionary(socket,dictionary);
	});
}

Game.prototype = {
	init(socket) {
		this.store = {};
		this.roundCount = 1;
		this.attachListeners(socket);
		this.attachFirebase();
		this.resetGame();
	},

	getDictionary(socket, dictionary='default') {
		firebase.db.ref('/dictionarys/' + dictionary).on('value',(snapshot)=>{
			this.dictionary = [];
			this.dictionaryObj = snapshot.val();
			for(word in this.dictionaryObj) {
				this.dictionary.push(word);
			}
			this.dictionaryBackup = this.dictionary.slice(0);
			firebase.db.ref('/dictionary').off();
			
			if(socket) { 
				this.init(socket);
			}
		});		
	},

	attachFirebase() {
		this.database.on('value',this.updateStore.bind(this));
	},

	attachListeners(socket) {
		this.sockets[socket.userId] = socket;

		// join room and add to db
		room.handler(this.id,socket);

		socket.on('path update',(path)=>{
			let ref = this.database.child('/paths/');
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
			this.pauseRound();

			setTimeout(()=>{
				this.endRound();
				this.deleteUser(socket);				
			},5000);

		} else {
			this.deleteUser(socket);
		}		
	},

	deleteUser(socket={}) {
		for(let object in this.sockets) {
			if(socket.id === this.sockets[object].id) {
				delete this.sockets[object];
			}
		}

		this.removeUserFromGame(socket.conn.id);
	},

	removeUserFromGame(user) {
		this.database.child('users').child(user).remove();
	},

	updateStore(snapshot) {
		this.store = snapshot.val();
		this.store.currentRoom = '/rooms/' + this.id;
		for(let socket in this.sockets) {
			this.sockets[socket].emit('store update', this.store);
		};
	},

	startRound() {
		this.getPuzzle();
		this.startInterval();
		this.database.update({
			status: 'playing'
		})
	},

	startInterval() {
		this.interval = setInterval(this.countdown.bind(this),1000);
	},

	pauseRound() {
		clearInterval(this.interval);
		this.database.update({
			status: 'paused'
		})
	},

	unpauseRound() {
		this.startInterval();
		this.database.update({
			status: 'playing'
		})
	},

	getPuzzle() {
		if(!this.dictionary.length) {
			this.dictionary = this.dictionaryBackup.slice(0);
		}

		let max = this.dictionary.length - 1;
		let random = Math.floor(Math.random() * (max - 1)) + 1;
		this.createPuzzleArray(this.dictionary[random]);		
		let puzzleIndex = this.dictionary.indexOf(this.puzzle);
		this.dictionary.splice(puzzleIndex,1);

		this.informTheCaptain();
	},

	createPuzzleArray(word) {
		this.puzzle = word;
		this.puzzleArray = [];
		this.wordLength = []
		let words = word.split(' ');

		words.forEach((arrWord,index)=>{
			this.puzzleArray[index] = this.puzzleArray[index] || [];
			this.wordLength[index] = this.wordLength[index] || [];

			for(var i = 0; i < arrWord.length; i++) {
				this.puzzleArray[index].push(arrWord.charAt(i));
				this.wordLength[index].push('_');
			}
		});
	},

	informTheCaptain() {
		for(user in this.store.users) {
			if(this.store.users[user].status === 'captain') {
				this.sockets[user].emit('puzzle',this.puzzleArray)
			} else {
				this.sockets[user].emit('puzzle',this.wordLength)
			}
		}
	},

	clueForTheSailors() {
		this.getClue();

		for(user in this.store.users) {
			let userObj = this.store.users[user];

			if(userObj.status !== 'captain' && !userObj.correct) {
				this.sockets[user].emit('puzzle',this.wordLength);
			}
		}
	},

	getClue() {
		let random = Math.floor((Math.random() * this.puzzleArray.length));
		let random2 = Math.floor((Math.random() * this.puzzleArray[random].length));

		this.wordLength[random][random2] = this.puzzleArray[random][random2];
	},

	replaceChar(string, index, char) {
		 return string.substr(0, index) + char + string.substr(index+char.length);
	},

	parseMessage(message) {
		message.message = message.message.toString().toLowerCase();

		if(message.message === this.puzzle) {
			this.cleverSailor(message);			
		} else {
			let ref = this.database.child('/chatLog/').push(message);
		}
	},

	cleverSailor(message) {
		let newScore = this.calculatePoints(message.id);

		this.database.child('/users/').child(message.id).update({ correct: true, score: newScore } );
		this.sockets[message.id].emit('puzzle',this.puzzleArray);
		this.cleverSailors++;

		if(this.cleverSailors >= Object.keys(this.store.users).length - 1) {
			this.endRound();
		}
	},

	calculatePoints(id) {
		let currentScore = this.store.users[id].score || 0;
		let newScore = currentScore + this.timer;
		return newScore;
	},
	
	countdown() {
		if(this.timer < 1) {
			clearInterval(this.interval);

			for(let socket in this.sockets) {
				this.sockets[socket].emit('puzzle', this.puzzleArray);
			};

			setTimeout(()=>{
				this.endRound();
			},5000);
		} else {
			this.timer--;
			this.database.update({
				clock: this.timer
			})

			if(this.timer === 5 || this.timer === 2) {
				this.clueForTheSailors();
			}
		}
	},

	endRound() {
		clearInterval(this.interval);

		let users = this.store.users || {};
		usersArr = Object.keys(users) || [];

		if(this.roundCount >= usersArr.length * 2) {
			this.endGame();
		} else {
			if(usersArr.length <= 1) {
				this.getDictionary();
				this.resetRoom();				
			} else {
				this.newRound();
			}
		}		
	},

	newRound() {
		this.roundCount++;
		this.resetGame();
		this.newCaptain();
		this.startRound();
	},

	newCaptain() {
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

	setSailor(username) {
		this.database.child('users').child(username).update({
			status: 'sailor'
		})
	},

	setCaptain(username) {
		this.database.child('users').child(username).update({
			status: 'captain'
		})
	},

	endGame() {
		this.database.update({
			status: 'finished'
		})

		setTimeout(()=>{
			this.resetRoom();
		},10000);
	},

	resetGame() {
		this.database.update({
			status: 'pending'
		});

		this.database.child('paths').remove();
		this.cleverSailors = 0;
		this.resetClock();
		this.resetCorrectStatus();		

		for(let socket in this.sockets) {
			this.sockets[socket].emit('puzzle', []);
		};


	},

	resetCorrectStatus() {
		if(this.store.users) {
			let users = this.store.users;
			let usersArr = Object.keys(users) || [];

			for(let i = 0; i < usersArr.length; i++) {
				let username = usersArr[i];
				let user = users[username];

				this.database.child('users').child(username).update({
					correct: false
				})
			}
		}
	},

	resetClock() {
		this.timer = this.gameLength;
		this.database.update({
			clock: this.timer
		})
	},

	resetRoom() {
		this.resetGame();
		this.resetUsers();
		this.roundCount = 1;
	},

	resetUsers() {
		let users = this.store.users;
		
		for(let user in users) {
			this.database.child('users').child(user).update({
				correct: false,
				score: 0
			})
		}
	}
}

module.exports = Game;