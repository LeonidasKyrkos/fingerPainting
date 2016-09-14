const io = require('../../configureServer').io;
const _ = require('lodash');

// event library
const Eev = require('eev');
const e = new Eev();

// wrapper class for all Data manipulation methods
const DataConnection = require('./DataConnection');

const initialisation = require('../modules/game/initialisation');
const clientCommunication = require('../modules/game/clientCommunication');

const gameDefaults = {
	store: {},
	sockets: {},
	inactivePlayers: {},
	garbageQueue: [],
	settings: {
		roundCount: 1,
		gameLength: 90,
		rounds: 3,
		minimumPlayers: 3
	}	
}

// Fingerpainting game class
class Game {
	constructor(id){
		this.data = new DataConnection(id,e);
		this.id = id;
		this.game = Object.assign({},gameDefaults);

		initialisation.bind(this);
	}

	// Update the game's store by cloning the current path onto the new store and then replacing the old one.
	updateStore(store={}) {
		store.paths = _.clone(this.store.paths);
		this.store = store;

		// send the new store to all the clients and also update them of any changes to their state
		this.emitToAllSockets('store update', this.store);
		this.updateClientPlayerObject();
	}

	getDictionary(dictionary='default') {
		let promise = this.data.getDictionary(dictionary);

		promise.then((snapshot)=>{
			this.game.dictionary = [];
			this.game.dictionaryObj = snapshot;

			// make an array out of our dictionary object and lowercase everything.
			for(let word in this.dictionaryObj) {
				this.game.dictionary.push(word.toLowerCase());
			}

			this.game.dictionaryBackup = this.game.dictionary.slice(0);
		});	
	}
}