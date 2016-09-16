const _ = require('lodash');

// Fingerpainting game handler

class Fingerpainting {
	constructor(App) {
		this.App = App;
		this.game = this.App.game;
		this.store = this.store;
	}

	// PRIMARY FUNCTIONS

	newRound() {
		// Increment the round count
		this.App.setGetter.setGameProperty('roundCount',this.game.roundCount++);
		this.resetGame();
		this.findNewPainter();
		this.startRound();
	}

	startRound() {
		let players = this.store.players || {};
		let playersLength = Object.keys(players).length;

		// if there are players and a dictionary, start the round.
		if(playersLength && this.dictionary) {
			this.App.setGetters.setPuzzle(this.App.setGetters.getPuzzle());
			this.App.clientComms.emitToPainter('puzzle',this.game.puzzleArray);
			this.App.clientComms.emitToGuessers('puzzle',this.game.clue);
			this.App.setGetters.setGameStoreProperty('status','playing');
			this.startInterval();			
		}
	}

	endRound() {
		this.endInterval();

		let intRemainingPlayers = this.App.setGetters.getIntRemainingGuessers();
		let boolRemainingTurns = this.App.setGetters.getBoolRemainingTurns();

		if(!boolRemainingTurns) {
			this.endGame();
			return;
		}

		if(intRemainingPlayers < this.game.settings.minimumPlayers) {
			this.resetRoom();
			return;
		}

		if(this.store.status === 'playing') {
			// trigger the delay that occurs before the next round starts
			this.tweenRounds();
		} else {
			// in the pending phase & waiting for players so just switch to a new painter
			this.findNewPainter();
		}
	}

	endGame() {
		if(this.store.players) {
			this.App.setGetters.setGameStoreProperty('status','finished');

			// let them marvel at the scoreboard for 5 seconds and then reset the room
			setTimeout(()=>{ this.resetRoom() },5000);
		} else {
			this.resetRoom();
		}
	}

	correctAnswer(playerId) {
		let player = this.store.players[playerId];
		this.App.clientComms.emitToSocket(this.game.sockets[playerId],'puzzle',this.game.puzzleArray);
		this.App.clientComms.emitToAllSockets('correct');

		this.App.playerHandler.rewardPlayers(player);
	}

	// Countdown from game.settings.gameLength and associated logic
	countdown() {
		if(this.game.timer < 1) {
			this.endInterval();
			this.App.clientComms.emitToAllSockets('puzzle', this.game.puzzleArray);
			this.endRound();
		} else {
			this.game.timer--;
			this.App.data.updateTimer(this.game.timer);
			this.clueHandler();
		}
	}

	clueHandler() {
		// Current game time
		let time = this.game.timer;

		// Timestamps based on length of game
		let firstClueTime = Math.floor(this.game.settings.gameLength * 0.666);
		let secondClueTime = Math.floor(this.game.settings.gameLength * 0.333);
		let finalClueTime = Math.floor(this.game.settings.gameLength * 0.15);

		// If the current time = any of our clue timestamps then emit a clue to the remaining guessers
		if(time === firstClueTime || time === secondClueTime || time === finalClueTime) {
			let clue = this.App.setGetters.getClue();

			this.App.clientComms.emitToStupidPlayers('puzzle',clue);
		}
	}




	// UTILITIES: Helper functions
	//------------------------------

	// Include a 5 second delay at the end of each round.
	tweenRounds() {
		let timer = 5;
		this.game.settings.blockUpdates = true;

		let delay = setInterval(()=>{
			this.App.clientComms.emitToAllSockets('notification',{
				text: 'Next round starting in ' + timer, 
				type: 'default'
			});

			if(timer <= 0) {
				this.game.settings.blockUpdates = false;
				this.clientComms.clearNotification();
				this.newRound();
				clearInterval(delay);
			}

			timer--;
		},1000);
	}

	findNewPainter() {
		// find remaining players with player.turns < this.game.settings.turns
		let remainingPlayers = this.App.setGetters.getRemainingPlayers();

		// find the index of the current painter in that set
		let index = _.findIndex(remainingPlayers,(player)=>{
			return player.status = 'painter';
		});

		// save the player object for the current painter from the remaining players list
		let currentPainter = remainingPlayers[index];

		// set current painter to guesser and increment their turns
		this.App.setGetters.setPlayerProperty(currentPainter,'status','guesser');
		this.App.setGetters.setPlayerProperty(currentPainter,'turns',currentPainter.turns + 1);

		// if the index of the current painter is the last in the list then set the
		// first player in the list to be the painter. Otherwise set the next index.
		let nextPlayerId = index === remainingPlayers.length - 1 ? emainingPlayers[0].id : remainingPlayers[index+1].id;
		this.App.setGetters.setPlayerProperty(remainingPlayers[nextPlayerId],'status','painter');
	}

	// Start timer
	startInterval() {
		this.setGetters.setGameProperty('interval',setInterval(this.countdown.bind(this),1000));
	}

	// Stop timer 
	endInterval() {
		clearInterval(this.game.interval);
	}

	// Msg received from client. Test to see if it's a correct guess
	parseMsg(msg) {
		let text = msg.message.toString();
		let boolPainter = this.App.tests.testForPainter(msg.id);

		if(text.toLowerCase() === this.puzzle) {
			// If it's the painter don't show the msg
			if(!painter) {
				this.correctAnswer(msg.id);
			}
		} else {
			this.App.data.pushMessage(msg);
		}		
	}

	// RESETS: Game resets for end of rounds & games

	// Full reset of game room for a new game to begin
	resetRoom() {
		this.resetGame();
		this.App.setGetters.setGameStoreProperty('status','pending');
		this.App.setGetters.setPlayersProperty('turns',0);
		this.App.setGetters.setGameProperty('inactivePlayers',{})
		this.App.setGetters.setGameProperty('roundCount',1);
		this.App.playerHandler.resetScores();
		this.store.players ? this.findNewPainter() : false;
	}

	// Reset the game for a new round to begin
	resetGame() {
		this.App.setGetters.setGameProperty('timer',this.game.settings.gameLength);
		this.App.setGetters.setPlayersProperty('correct',false);
		this.App.setGetters.setGameStoreProperty('paths',{});
		this.App.setGetters.setGameStoreProperty('chatLog',{});
		this.App.clientComms.emitToAllSockets('reset');
		this.App.clientComms.emitToAllSockets('puzzle',[]);
	}
}

module.exports = Fingerpainting;