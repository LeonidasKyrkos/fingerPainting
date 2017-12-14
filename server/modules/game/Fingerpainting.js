const _ = require('lodash');

// Fingerpainting game handler
class Fingerpainting {
	constructor(App) {
		this.App = App;
	}

	newRound() {
		// Increment the round count
		this.resetGame();
		this.findNewPainter();
		this.startRound();
	}

	startRound() {
		let players = this.App.game.store.players || {};
		let playersLength = Object.keys(players).length;

		// if there are players and a dictionary, start the round.
		if(playersLength && this.App.game.dictionary.length) {
			this.App.setGetters.setPuzzle(this.App.setGetters.getPuzzle());
			this.App.clientComms.emitToPainter('puzzle', this.App.game.puzzleArray);
			this.App.clientComms.emitToGuessers('puzzle', this.App.game.clue);
			this.App.setGetters.setGameStoreProperty('status', 'playing');
			this.startInterval();			
		}
	}

	endRound() {
		this.endInterval();

		let intRemainingPlayers = parseInt(this.App.setGetters.getIntRemainingGuessers());
		let boolRemainingTurns = this.App.setGetters.getBoolRemainingTurns();

		if(intRemainingPlayers < this.App.game.settings.minimumPlayers) {
			this.resetRoom();
			return;
		}

		if(!boolRemainingTurns) {
			this.endGame();
			return;
		}		

		if(this.App.game.store.status === 'playing') {
			// trigger the delay that occurs before the next round starts
			this.tweenRounds();
		} else {
			// in the pending phase & waiting for players so just switch to a new painter
			this.findNewPainter();
		}
	}

	endGame() {
		if(this.App.game.store.players) {
			this.App.setGetters.setGameStoreProperty('status', 'finished');

			// let them marvel at the scoreboard for 5 seconds and then reset the room
			setTimeout(this.resetRoom.bind(this), 5000);
		} else {
			this.resetRoom();
		}
	}

	correctAnswer(playerId) {
		let player = this.App.game.store.players[playerId];
		this.App.data.updatePlayer(playerId, {correct: true});
		this.App.clientComms.emitToSocket(this.App.game.sockets[playerId],'puzzle', this.App.game.puzzleArray);
		this.App.clientComms.emitToAllSockets('correct');
		this.pointHandler(player);
	}

	pointHandler(player={}) {
		this.App.playerHandler.rewardPlayer(player);

		// make array of players that are correct
		let correctPlayers = _.filter(this.App.game.store.players, player => {
			return player.correct;
		});

		// if this is the first correct answer then reward the painter based on
		// the remaining time equal to that of the guesser
		if(correctPlayers.length === 1) {			
			let artist = _.find(this.App.game.store.players, { status: 'painter' });
			this.App.playerHandler.rewardPlayer(artist);
		}

		// if there are as many correct players as there can be then end the round
		if(correctPlayers.length >= Object.keys(this.App.game.store.players).length - 1) {
			this.endRound();
		}
	}

	// Countdown from game.settings.gameLength and associated logic
	countdown() {
		if(this.timer < 1) {
			this.endInterval();
			this.App.clientComms.emitToAllSockets('puzzle', this.App.game.puzzleArray);
			this.endRound();
		} else {
			this.timer--;
			this.App.data.updateTimer(this.timer);
			this.clueHandler();
		}
	}

	clueHandler() {
		// Current game time
		const time = this.timer;

		// Timestamps based on length of game
		const firstClueTime = Math.floor(this.App.game.settings.gameLength * 0.666);
		const secondClueTime = Math.floor(this.App.game.settings.gameLength * 0.333);
		const finalClueTime = Math.floor(this.App.game.settings.gameLength * 0.15);

		// If the current time = any of our clue timestamps then emit a clue to the remaining guessers
		if(time === firstClueTime || time === secondClueTime || time === finalClueTime) {
			let clue = this.App.setGetters.getClue();

			this.App.clientComms.emitToStupidPlayers('puzzle', clue);
		}
	}

	// UTILITIES: Helper functions
	//------------------------------

	// Include a 5 second delay at the end of each round.
	tweenRounds() {
		let timer = 5;
		this.App.game.settings.blockUpdates = true;

		let delay = setInterval(()=>{
			this.App.clientComms.emitToAllSockets('notification', {
				text: 'Next round starting in ' + timer, 
				type: 'default'
			});

			if (timer <= 0) {
				clearInterval(delay);
				this.App.game.settings.blockUpdates = false;
				this.App.clientComms.clearNotification();
				this.newRound();
			}

			timer--;
		}, 1000);
	}

	/**
	 * Get the next painter
	 */
	findNewPainter() {
		// find remaining players with player.turns < this.App.game.settings.turns
		let remainingPlayers = this.App.setGetters.getRemainingPlayers();

		if(remainingPlayers && Object.keys(remainingPlayers).length <= 1) {
			this.resetRoom();
			return;
		}

		// find the index of the current painter in that set
		let currentPlayerIndex = _.findIndex(remainingPlayers, player => {
			return player.status === 'painter';
		});

		// save the player object for the current painter from the remaining players list
		let currentPainter = remainingPlayers[currentPlayerIndex];

		// set current painter to guesser and increment their turns
		this.App.setGetters.setPlayerProperty(currentPainter, 'status', 'guesser');
		this.App.setGetters.setPlayerProperty(currentPainter, 'turns', parseInt(currentPainter.turns) + 1);

		// if the index of the current painter is the last in the list then set the
		// first player in the list to be the painter. Otherwise set the next index.
		const nextPlayerId = currentPlayerIndex === remainingPlayers.length - 1 ? remainingPlayers[0].id : remainingPlayers[currentPlayerIndex + 1].id;

		this.App.setGetters.setPlayerProperty(this.App.game.store.players[nextPlayerId], 'status', 'painter');
	}

	// Start timer
	startInterval() {
		this.timer = this.App.game.settings.gameLength;

		this.interval = setInterval(()=>{
			this.countdown()
		}, 1000);
	}

	// Stop timer 
	endInterval() {
		clearInterval(this.interval);
	}

	// Msg received from client. Test to see if it's a correct guess
	parseMsg(msg={}) {
		let text = msg.message.toString();
		let boolPainter = this.App.tests.testForPainter(msg.id);

		if(text.toLowerCase() === this.App.game.puzzle) {
			// If it's the painter don't show the msg
			if(!boolPainter) {
				this.correctAnswer(msg.id);
			}
		} else {
			this.App.data.pushMessage(msg);
		}	
	}

	// RESETS: Game resets for end of rounds & games

	// Full reset of game room for a new game to begin
	resetRoom() {
		this.App.setGetters.setGameStoreProperty('status', 'pending');		
		this.App.setGetters.setGameProperty('inactivePlayers', {})
		this.App.setGetters.setGameStoreProperty('clock', this.App.game.settings.gameLength);
		this.App.playerHandler.resetPlayerScores();
		this.App.setGetters.setPlayersProperty('turns', 0);
		
		if(this.App.game.store.players) {
			this.resetGame();
		}
	}

	// Reset the game for a new round to begin
	resetGame() {
		this.App.setGetters.setGameProperty('timer', this.App.game.settings.gameLength);
		this.App.setGetters.setPlayersProperty('correct', false);		
		this.App.setGetters.setGameStoreProperty('paths', {});
		this.App.setGetters.setGameStoreProperty('chatLog', {});
		this.App.clientComms.emitToAllSockets('reset');
		this.App.clientComms.emitToAllSockets('puzzle', []);
	}
}

module.exports = Fingerpainting;