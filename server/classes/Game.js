let io = require('../../configureServer').io;
let room = require('../modules/room');
let _ = require('lodash');
let Eev = require  ('eev'); 
let e = new Eev(); // event emitter
let DataConnection = require ('./DataConnection'); 

class Game {
	constructor(player,socket) {
		this.data = new DataConnection(player.gameroom,e); // data connection class that handles db requests
		this.id = player.gameroom;
		this.gameLength = 90;
		this.init(player, socket);
	}	

	init(player, socket) {
		this.store = {};
		this.sockets = {};
		this.roundCount = 1;		
		this.attachDataListener();
		this.getDictionary();
		this.newPlayer(player, socket);
		this.resetGame();
	}

	newPlayer(player,socket) {
		this.sockets[player.id] = socket;

		if(!this.store.players) {
			player.status = 'painter';
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
		socket.on('disconnect',this.handleDisconnect.bind(this,player.id));
	}

	attachDataListener() {
		e.on('store',(store)=>{
			this.prepStoreAndCallUpdate(store);
		});

		this.data.listenToData(this,e);		
	}	

	getDictionary(dictionary='default') {
		let promise = this.data.getDictionary(dictionary);

		promise.then((snapshot)=>{
			this.dictionary = [];
			this.dictionaryObj = snapshot;
			for(let word in this.dictionaryObj) {
				this.dictionary.push(word.toLowerCase());
			}
			this.dictionaryBackup = this.dictionary.slice(0);
		});		
	}

	handleDisconnect(playerId) {
		let player = this.store.players[playerId];
		
		if(player.status === 'painter') {
			this.removePlayerFromGame(player);
			this.endRound();
		} else {
			this.removePlayerFromGame(player);
		}		
	}

	removePlayerFromGame(player) {
		this.data.removePlayer(player.id);
		delete(this.sockets[player.id]);
	}

	prepStoreAndCallUpdate(store) {
		store.paths = _.clone(this.store.paths);
		this.updateStore(store);
	}

	updateStore(store) {
		this.store = store;
		this.store.currentRoom = '/rooms/' + this.id;
		this.emitToAllSockets('store update', this.store);
	}

	startRound() {
		if(this.dictionary) {
			this.getPuzzle();
			this.startInterval();
			this.data.setStatus('playing');
		}
	}

	startInterval() {
		this.interval = setInterval(this.countdown.bind(this),1000);
	}

	pauseRound() {
		clearInterval(this.interval);
		this.data.setStatus('paused');
	}

	unpauseRound() {
		this.startInterval();
		this.data.setStatus('playing');
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

		this.informThePainter();
	}

	createPuzzleArray(word) {
		this.puzzle = word;
		this.puzzleArray = [];
		this.clue = []
		let words = word.split(' ');

		words.forEach((arrWord,index)=>{
			this.puzzleArray[index] = this.puzzleArray[index] || [];
			this.clue[index] = this.clue[index] || [];

			for(var i = 0; i < arrWord.length; i++) {
				this.puzzleArray[index].push(arrWord.charAt(i));
				this.clue[index].push('_');
			}
		});
	}

	informThePainter() {
		for(let player in this.store.players) {
			if(this.store.players[player].status === 'painter') {
				this.sockets[player].emit('puzzle',this.puzzleArray)
			} else {
				this.sockets[player].emit('puzzle',this.clue)
			}
		}
	}

	clueForTheGuessers() {
		this.getClue();

		for(let player in this.store.players) {
			let playerObj = this.store.players[player];

			if(playerObj.status !== 'painter' && !playerObj.correct) {
				this.sockets[player].emit('puzzle',this.clue);
			}
		}
	}

	getClue() {
		let random = Math.floor((Math.random() * this.puzzleArray.length));
		let random2 = Math.floor((Math.random() * this.puzzleArray[random].length));

		this.clue[random][random2] = this.puzzleArray[random][random2];
	}

	replaceChar(string, index, char) {
		 return string.substr(0, index) + char + string.substr(index+char.length);
	}

	checkIfPainter(id) {
		if(this.store.players && this.store.players[id] && this.store.players[id].status === 'painter') {
			return true;
		} else {
			return false;
		}
	}

	parseMessage(message) {
		message.message = message.message.toString();
		let painter = this.checkIfPainter(message.id);

		if(message.message.toLowerCase() === this.puzzle) {
			if(!painter) {
				this.cleverGuesser(message);	
			}					
		} else {
			this.data.pushMessage(message)
		}
	}

	cleverGuesser(message) {
		let newScore = this.calculatePoints(message.id);
		this.data.updatePlayer(message.id, { correct: true, score: newScore })
		this.sockets[message.id].emit('puzzle',this.puzzleArray);
		this.cleverGuessers++;

		this.emitToAllSockets('correct');

		if(this.cleverGuessers >= Object.keys(this.store.players).length - 1) {
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
			this.data.updateTimer(this.timer);

			if(this.timer === 60 || this.timer === 30 || this.timer === 10) {
				this.clueForTheGuessers();
			}
		}
	}

	endRound() {
		clearInterval(this.interval);

		let players = this.store.players || {};
		let playersArr = Object.keys(players) || [];

		if(this.roundCount >= playersArr.length * 2) {
			this.endGame();
		} else {
			if(playersArr.length <= 1) {
				this.resetRoom();				
			} else {
				this.newRound();
			}
		}		
	}

	newRound() {
		this.roundCount++;
		this.resetGame();
		this.newPainter();
		this.startRound();
		this.emitToAllSockets('new round');
	}

	newPainter() {
		let players = this.store.players;
		let playersArr = Object.keys(players) || [];

		for(let i = 0; i < playersArr.length; i++) {
			let username = playersArr[i];
			let player = players[username];

			if(player.status === 'painter') {
				this.setGuesser(username);

				if(i === playersArr.length - 1) {
					var nextUsername = playersArr[0];
				} else {
					var nextUsername = playersArr[i+1];
				}

				this.setPainter(nextUsername);	

				break;
			}
		}
	}

	setGuesser(username) {
		this.data.setPlayerStatus(username,'guesser');
	}

	setPainter(username) {
		this.data.setPlayerStatus(username,'painter');
	}

	endGame() {
		// update the status of the room to trigger the scoreboard and then wait 5s to reset for next round
		if(this.store.users) {
			this.data.setStatus('finished');

			setTimeout(()=>{
				this.resetRoom();
			},5000);
		} else {
			this.resetRoom();
		}
	}

	resetGame() {
		this.data.setStatus('pending');
		this.cleverGuessers = 0;
		this.resetClock();
		this.resetCorrectStatus();
		this.emitToAllSockets('puzzle',[]);
		if(this.store.players) {
			this.setPainter(this.store.players[Object.keys(this.store.players)[0]].id);
		}
	}

	resetCorrectStatus() {
		if(this.store.players) {
			let players = this.store.players;
			let playersArr = Object.keys(players) || [];

			for(let i = 0; i < playersArr.length; i++) {
				let username = playersArr[i];
				this.data.updatePlayer(username, { correct: false })
			}
		}
	}

	resetClock() {
		this.timer = this.gameLength;
		this.data.updateTimer(this.timer);
	}

	resetRoom() {
		this.resetGame();
		this.resetPlayers();
		this.roundCount = 1;
		this.resetChatlog();
	}

	resetPlayers() {
		let players = this.store.players;
		
		for(let player in players) {
			this.data.updatePlayer(player, { correct: false, score: 0 })
		}
	}

	resetChatlog() {
		this.data.clearChat();
	}

	emitToAllSockets(type,emission) {
		for(let socket in this.sockets) {
			this.sockets[socket].emit(type, emission);
		};
	}
}



module.exports = Game;