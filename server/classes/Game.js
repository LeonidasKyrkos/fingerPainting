let io = require('../../configureServer').io;
let firebase = require('../modules/firebaseConfig');
let room = require('../modules/room');
let _ = require('lodash');

class Game {
	constructor(player,socket,database) {
		this.id = player.gameroom;
		this.database = database;
		this.gameLength = 90;

		this.database.child('dictionary').on('value',(snapshot)=>{
			let dictionary = snapshot.val();
			this.getDictionary(player,socket,dictionary);
		});
	}	

	getDictionary(player, socket, dictionary='default') {
		firebase.db.ref('/dictionarys/' + dictionary).on('value',(snapshot)=>{
			this.dictionary = [];
			this.dictionaryObj = snapshot.val();
			for(let word in this.dictionaryObj) {
				this.dictionary.push(word.toLowerCase());
			}
			this.dictionaryBackup = this.dictionary.slice(0);
			firebase.db.ref('/dictionary').off();
			
			if(player) { 
				this.init(player,socket);
			}
		});		
	}

	init(player, socket) {
		this.store = {};
		this.sockets = {};
		this.roundCount = 1;
		this.newPlayer(player, socket);
		this.attachFirebase();
		this.resetGame();
	}

	newPlayer(player,socket) {
		this.sockets[player.id] = socket;

		if(!this.store.players) {
			player.status = 'captain';
		}

		// join room and add to db
		room.handler(this.id,player);

		socket.on('path update',(path)=>{
			this.store.paths = path;
			this.updateStore(this.store);
		});

		socket.on('start round',this.startRound.bind(this));
		socket.on('pause round',this.pauseRound.bind(this));
		socket.on('unpause round',this.unpauseRound.bind(this));
		socket.on('message',this.parseMessage.bind(this));
		socket.on('disconnect',this.handleDisconnect.bind(this,player));
	}

	attachFirebase() {
		this.database.on('value',(snapshot)=>{
			let store = snapshot.val();
			store.paths = _.clone(this.store.paths);

			this.updateStore(store);
		});
	}

	handleDisconnect(player) {
		if(player.status === 'captain') {
			this.pauseRound();

			setTimeout(()=>{
				this.endRound();
				this.removePlayerFromGame(player);				
			},5000);

		} else {
			this.removePlayerFromGame(player);
		}		
	}

	removePlayerFromGame(player) {
		this.database.child('players').child(player.id).remove();
		delete(this.sockets[player.id]);
	}

	updateStore(store) {
		this.store = store;
		this.store.currentRoom = '/rooms/' + this.id;
		this.emitToAllSockets('store update', this.store);
	}

	startRound() {
		this.getPuzzle();
		this.startInterval();
		this.database.update({
			status: 'playing'
		})
	}

	startInterval() {
		this.interval = setInterval(this.countdown.bind(this),1000);
	}

	pauseRound() {
		clearInterval(this.interval);
		this.database.update({
			status: 'paused'
		})
	}

	unpauseRound() {
		this.startInterval();
		this.database.update({
			status: 'playing'
		})
	}

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
	}

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
	}

	informTheCaptain() {
		for(let user in this.store.players) {
			if(this.store.players[user].status === 'captain') {
				this.sockets[user].emit('puzzle',this.puzzleArray)
			} else {
				this.sockets[user].emit('puzzle',this.wordLength)
			}
		}
	}

	clueForTheSailors() {
		this.getClue();

		for(let user in this.store.players) {
			let userObj = this.store.players[user];

			if(userObj.status !== 'captain' && !userObj.correct) {
				this.sockets[user].emit('puzzle',this.wordLength);
			}
		}
	}

	getClue() {
		let random = Math.floor((Math.random() * this.puzzleArray.length));
		let random2 = Math.floor((Math.random() * this.puzzleArray[random].length));

		this.wordLength[random][random2] = this.puzzleArray[random][random2];
	}

	replaceChar(string, index, char) {
		 return string.substr(0, index) + char + string.substr(index+char.length);
	}

	checkIfCaptain(id) {
		if(this.store.players && this.store.players[id] && this.store.players[id].status === 'captain') {
			return true;
		} else {
			return false;
		}
	}

	parseMessage(message) {
		message.message = message.message.toString();
		let captain = this.checkIfCaptain(message.id);

		if(message.message.toLowerCase() === this.puzzle) {
			if(!captain) {
				this.cleverSailor(message);	
			}					
		} else {
			let ref = this.database.child('/chatLog/').push(message);
		}
	}

	cleverSailor(message) {
		let newScore = this.calculatePoints(message.id);

		this.database.child('players').child(message.id).update({ correct: true, score: newScore } );
		this.sockets[message.id].emit('puzzle',this.puzzleArray);
		this.cleverSailors++;

		if(this.cleverSailors >= Object.keys(this.store.players).length - 1) {
			this.endRound();
		}
	}

	calculatePoints(id) {
		let currentScore = this.store.players[id].score || 0;
		let newScore = currentScore + this.timer;
		return newScore;
	}

	countdown() {
		if(this.timer < 1) {
			clearInterval(this.interval);
			this.emitToAllSockets('puzzle', this.puzzleArray)

			setTimeout(()=>{
				this.endRound();
			},5000);
		} else {
			this.timer--;
			this.database.update({
				clock: this.timer
			})

			if(this.timer === 60 || this.timer === 30 || this.timer === 10) {
				this.clueForTheSailors();
			}
		}
	}

	endRound() {
		clearInterval(this.interval);

		let players = this.store.players || {};
		let playersArr = Object.keys(players) || [];
		this.resetPaths();

		if(this.roundCount >= playersArr.length * 2) {
			this.endGame();
		} else {
			if(playersArr.length <= 1) {
				this.getDictionary();
				this.resetRoom();				
			} else {
				this.newRound();
			}
		}		
	}

	newRound() {
		this.roundCount++;
		this.resetGame();
		this.newCaptain();
		this.startRound();
		this.emitToAllSockets('new round');
	}

	newCaptain() {
		let users = this.store.players;
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
	}

	setSailor(username) {
		this.database.child('players').child(username).update({
			status: 'sailor'
		})
	}

	setCaptain(username) {
		this.database.child('players').child(username).update({
			status: 'captain'
		})
	}

	endGame() {
		// update the status of the room to trigger the scoreboard and then wait 5s to reset for next round
		this.database.update({
			status: 'finished'
		})

		setTimeout(()=>{
			this.resetRoom();
		},5000);
	}

	resetGame() {
		this.database.update({
			status: 'pending'
		});

		this.resetPaths();
		this.cleverSailors = 0;
		this.resetClock();
		this.resetCorrectStatus();
		this.emitToAllSockets('puzzle',[]);
	}

	resetPaths() {
		this.database.child('paths').remove();
	}

	resetCorrectStatus() {
		if(this.store.players) {
			let users = this.store.players;
			let usersArr = Object.keys(users) || [];

			for(let i = 0; i < usersArr.length; i++) {
				let username = usersArr[i];
				let user = users[username];

				this.database.child('players').child(username).update({
					correct: false
				})
			}
		}
	}

	resetClock() {
		this.timer = this.gameLength;
		this.database.update({
			clock: this.timer
		})
	}

	resetRoom() {
		this.resetGame();
		this.resetUsers();
		this.roundCount = 1;
		this.resetChatlog();
	}

	resetUsers() {
		let users = this.store.players;
		
		for(let user in users) {
			this.database.child('players').child(user).update({
				correct: false,
				score: 0
			})
		}
	}

	resetChatlog() {
		this.database.child('chatLog').remove();
	}

	emitToAllSockets(type,emission) {
		for(let socket in this.sockets) {
			this.sockets[socket].emit(type, emission);
		};
	}
}



module.exports = Game;