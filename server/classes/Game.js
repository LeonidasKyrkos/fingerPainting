let io = require('../../configureServer').io;
let room = require('../modules/room');
let _ = require('lodash');
let Eev = require  ('eev'); 
let e = new Eev(); // event emitter
let DataConnection = require ('./DataConnection'); 

class Game {
	constructor(id,player,socket) {
		this.data = new DataConnection(id,e); // data connection class that handles db requests
		this.id = id;
		this.gameLength = 90;
		this.rounds = 3;
		this.init(player, socket);
	}	

	init(player, socket) {
		this.store = {};
		this.sockets = {};
		this.data.resetPlayers();
		this.inactivePlayers = {};
		this.garbageQueue = [];
		this.roundCount = 1;	
		this.attachDataListener();

		if(player) {
			this.newPlayer(player, socket);	
		}
		
		this.resetRoom();

		this.garbageTimer = setInterval(()=>{
			if(!this.blockUpdates) {
				this.garbageCollection();	
			}
		},1000);
	}

	attachDataListener() {
		e.on('store',(store)=>{
			if(!this.dictionary || store && this.store.dictionary !== store.dictionary) { this.getDictionary(store.dictionary); };
			this.prepStoreAndCallUpdate(store);
		});

		this.data.listenToData();
	}

	newPlayer(player,socket) {
		this.sockets[player.id] = socket;

		if(!this.store.players) {
			player.status = 'painter';
		}

		if(this.inactivePlayers[player.refreshToken]) {
			this.reinstantiatePlayer(player);
		}

		// join room and add to db
		room.handler(player.gameroom,player);

		socket.emit('join room','/rooms/' + this.id);
		socket.emit('player',player);

		socket.on('path update',(paths)=>{
			this.emitToGuessers('path update',paths);
		});

		socket.on('start round',this.startRound.bind(this));
		socket.on('pause round',this.pauseRound.bind(this));
		socket.on('unpause round',this.unpauseRound.bind(this));
		socket.on('message',(message)=>{
			if(!this.blockUpdates) {
				this.parseMessage(message);
			}			
		});
		socket.on('disconnect',this.handleDisconnect.bind(this,player.id));
	}

	reinstantiatePlayer(player) {
		player.score = this.inactivePlayers[player.refreshToken].score;

		this.removeInactivePlayers(player);
	}

	removeInactivePlayers(player){
		delete this.inactivePlayers[player.refreshToken];
	}

	prepStoreAndCallUpdate(store={}) {
		if(store) {
			store.paths = _.clone(this.store.paths);
			this.updateStore(store);
		}
	}

	updateStore(store) {
		this.store = store;
		this.emitToAllSockets('store update', this.store);
		this.updateClientPlayerObject();
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
		
		if(player.status === 'painter' && this.store.status === 'playing') {
			this.addToGarbageQueue(player);
			this.endRound();
			return;
		} 

		if(player.status === 'painter') {
			this.newPainter();
		}
		
		this.removePlayerFromGame(player);
	}

	addToGarbageQueue(player) {
		this.garbageQueue.push(player);
	}

	garbageCollection() {
		this.garbageQueue.forEach((player,index)=>{
			this.removePlayerFromGame(player);
			this.garbageQueue.splice(index, 1);
		});	
	}

	removePlayerFromGame(player) {
		this.data.removePlayer(player.id);
		delete(this.sockets[player.id]);
		this.moveToInactive(player);
	}

	moveToInactive(player) {
		this.inactivePlayers[player.refreshToken] = _.clone(player);
	}

	updateClientPlayerObject() {
		for(let id in this.sockets) {
			for(let playerId in this.store.players) {
				if(id === playerId) {
					this.sockets[id].emit('player',this.store.players[playerId]);
				}
			}
		}
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
			this.handleChatLog(message);
		}
	}

	handleChatLog(message) {
		this.data.pushMessage(message);
	}

	cleverGuesser(message) {
		let newScore = this.calculatePoints(message.id);
		this.data.updatePlayer(message.id, { correct: true, score: newScore });
		this.sockets[message.id].emit('puzzle',this.puzzleArray);
		this.cleverGuessers++;

		this.emitToAllSockets('correct');

		if(this.cleverGuessers === 1) {
			let artist = _.find(this.store.players,{status: 'painter'});
			newScore = this.calculatePoints(artist.id);
			this.data.updatePlayer(artist.id, { score: newScore });
		}

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
			this.endRound();
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
		let remaining = playersArr.length - this.garbageQueue.length;

		if(this.playerTurns()) {
			this.endGame();
			return;
		}

		if(remaining <= 1) {
			this.resetRoom();		
			return;		
		}

		if(this.store.status === 'playing') {
			this.roundDelay();
		} else {
			this.newPainter();
		}
	}

	// check number of turns of each active player
	playerTurns() {
		let count = 0;
		let players = this.store.players;

		for(let player in players) {
			if(players[player].turns < this.rounds) {
				count++;
			}
		}

		if(count <= 1) { return true } else { return false };
	}

	roundDelay() {
		let timer = 5;
		this.blockUpdates = true;

		this.delay = setInterval(()=>{
			this.emitToAllSockets('notification',{ text: 'Next round starting in ' + timer, type: 'default' });
			if(timer <= 0) {				
				this.blockUpdates = false;
				this.clearNotification();
				this.newRound();
				clearInterval(this.delay);
			}
			timer--;
		},1000);
	}

	newRound() {
		this.roundCount++;
		this.resetGame();
		this.data.setStore(this.store);
		this.newPainter();

		if(this.store.players && Object.keys(this.store.players).length > 1) {
			this.startRound();
		}		
	}

	newPainter() {
		let set = false;
		let players = this.store.players || {};
		let playersArr = [];

		for(let player in players) {
			playersArr.push(players[player]);
		}

		let remainingPlayers = _.filter(playersArr,(player)=>{ return player.turns < this.rounds });

		for(var index = 0; index <= remainingPlayers.length - 1; index++) {
			let playerId = remainingPlayers[index].id;
			let player = players[playerId];

			if(player.status === 'painter') {
				this.setGuesser(playerId);
				this.incrementPlayerTurns(playerId);


				if(index === remainingPlayers.length - 1) {
					var nextPlayerId = remainingPlayers[0].id;
				} else {
					var nextPlayerId = remainingPlayers[index+1].id;
				}

				this.setPainter(nextPlayerId);
				set = true;

				break;
			}
		}

		if(!set) {
			this.setPainter(playersArr[0].id);
		}
	}

	incrementPlayerTurns(playerId) {
		let turns = this.store.players[playerId].turns + 1;
		this.data.updatePlayerTurns(playerId,turns);
	}

	setGuesser(playerId) {
		this.data.setPlayerStatus(playerId,'guesser');
	}

	setPainter(playerId) {
		this.data.setPlayerStatus(playerId,'painter');
	}

	clearNotification() {
		this.emitToAllSockets('notification',{ text: '', type: 'default' });
	}

	endGame() {
		// update the status of the room to trigger the scoreboard and then wait 5s to reset for next round
		if(this.store.players) {
			this.data.setStatus('finished');

			setTimeout(()=>{
				this.resetRoom();
			},5000);
		} else {
			this.resetRoom();
		}
	}

	resetGame() {		
		this.resetClock();
		this.resetTurns();
		this.resetCorrectStatus();
		this.resetPath();
		this.emitToAllSockets('reset');
		this.resetChatlog();
		this.emitToAllSockets('puzzle',[]);
	}

	resetTurns() {
		let players = this.store.players || {};

		for(let player in players) {
			this.store.players[player].turns = 0;
		}
	}

	resetCorrectStatus() {
		this.cleverGuessers = 0;
		let players = this.store.players || {};

		for(let player in players) {
			this.store.players[player].correct = false;
		}
	}

	resetClock() {
		this.timer = this.gameLength;
		this.store.clock = this.timer;
	}

	resetRoom() {		
		this.resetGame();
		this.store.status = 'pending';
		this.resetPlayerScores();
		this.inactivePlayers = {};
		this.roundCount = 1;
		this.resetChatlog();
		this.data.setStore(this.store);

		if(this.store.players) {
			if(Object.keys(this.store.players).length === 1) {
				this.setPainter(this.store.players[Object.keys(this.store.players)[0]].id);
			} else {
				this.newPainter();
			}
		}		
	}

	resetPlayerScores() {
		let players = this.store.players;
		
		for(let player in players) {
			this.store.players[player].score = 0;
		}
	}

	resetChatlog() {
		this.store.chatLog = {};
	}

	resetPath() {
		this.store.paths = {};
	}

	emitToAllSockets(type,emission) {
		let sockets = this.sockets || {};

		for(let socket in sockets) {
			this.sockets[socket].emit(type, emission);
		};
	}

	emitToGuessers(type,emission) {
		for(let socket in this.sockets) {
			if(this.store.players[socket] && this.store.players[socket].status !== 'painter') {
				this.sockets[socket].emit(type, emission);
			}			
		};
	}
}



module.exports = Game;