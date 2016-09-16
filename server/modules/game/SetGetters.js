// Setting and getting handler

// libraries
const _ = require('lodash');

class SetGetters {
	constructor(App) {
		this.App = App;
		this.game = this.App.game;
		this.store = this.game.store;
	}

	setStore(store={}) {
		// Not storing the paths remotely so just cloning them onto each new store as they come through.
		store.paths = _.clone(this.store.paths);
		this.App.store = store;

		// Emit event informing the application that the store has been altered
		this.App.events.emit('store updated');
	}

	setGameStoreProperty(property='',state) {
		this.App.data.setChild(property,state);
	}

	setGameProperty(property='',state) {
		this.game[property] = state;
	}

	// set a property on an individual player
	setPlayerProperty(playerId,property,value) {
		let id = player.id;
		player[property] = value;

		this.App.data.setPlayer(id, player);
	}

	// Set a property for all currently active players
	setPlayersProperty(property,value) {
		let players = this.game.store.players || {};

		for(let player in players) {
			players[player][property] = value;
		}
	}

	// Set puzzle DUHHHHH
	setPuzzle(puzzle) {
		let data = this.getPuzzleAndClueArrays();

		this.setGameProperty('puzzle',puzzle);
		this.setGameProperty('puzzleArray',data.puzzleArray);
		this.setGameProperty('clue',data.clueArray)
	}

	// Add player to the garbage queue to be cleared by the interval
	addToGarbage(player) {
		this.game.garbageQueue.push(player);
	}

	// Get puzzle DUHHHHHHHHHHHHHHHH
	getPuzzle() {
		if(!this.game.dictionary.length) {
			this.setGameProperty('dictionary',this.game.dictionaryBackup.slice(0));
		}

		let max = this.game.dictionary.length - 1;
		let random = Math.floor(Math.random() * (max-1)) + 1;
		let puzzle = this.game.dictionary[random];
		this.game.dictionary.splice(random,1);

		return puzzle;
	}

	// Get clue DUHHHHHHHHHHHHHHHHHHHHHHHHHHH
	getClue() {
		let random = Math.floor((Math.random() * this.game.puzzleArray.length));
		let random2 = Math.floor((Math.random() * this.game.puzzleArray[random].length));

		this.game.clue[random][random2] = this.game.puzzleArray[random][random2];
	}

	// Create and return arrays of puzzle and clue
	getPuzzleAndClueArrays(puzzle) {
		let words = puzzle.split(' ');
		let puzzleArray = [];
		let clueArray = [];

		// loop through the words and create arrays for them inside of puzzleArray and cluearray
		words.forEach((word,index)=>{
			puzzleArray[index] = puzzleArray[index] || [];
			clueArray[index] = clueArray[index] || [];

			for(let i = 0; i < arrWord.length; i++) {
				puzzleArray[index].push(word.charAt(i));
				clueArray[index].push('_');
			}
		});

		return { puzzleArray: puzzleArray, clueArray: clueArray };
	}

	// Get dictionary and set it
	getDictionary(dictionary='default') {
		let promise = this.App.data.getDictionary(dictionary);

		promise.then((snapshot)=>{
			this.game.dictionary = [];
			this.game.dictionaryObj = snapshot;

			// make an array out of our dictionary object and lowercase everything.
			for(let word in this.dictionaryObj) {
				this.game.dictionary.push(word.toLowerCase());
			}

			this.setGameProperty('dictionaryBackup',this.game.dictionary.slice(0));
		});	
	}

	getRemainingPlayers() {
		let players = this.game.store.players;

		return _.filter(players,(player)=>{ return player.turns < this.game.settings.rounds });
	}

	getIntRemainingGuessers() {
		let players = this.store.players || {};
		let playersArr = Object.keys(players) || [];
		
		return playersArr.length - this.game.garbageQueue.length;
	}

	getBoolRemainingTurns() {
		return _.find(this.store.players, (player)=>{
			return player.turns < this.game.settings.gameLength;
		});
	}
}

module.exports = SetGetters;