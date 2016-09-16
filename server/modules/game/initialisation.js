// initialisation class for Game.js

const gameDefaults = {
	store: {},
	sockets: {},
	inactivePlayers: {},
	garbageQueue: [],
	settings: {
		roundCount: 1,
		gameLength: 90,
		rounds: 3,
		minimumPlayers: 3,
		blockUpdates: false
	}	
}

class Initialisation {
	constructor(App) {
		this.App = App;
		this.data = this.App.data;
		this.events = this.App.events;

		this.init();
	}

	init() {
		this.App.game = Object.assign({},gameDefaults);
		this.data.resetPlayers();
		this.attachDataListener();
	}

	attachDataListener() {
		this.events.on('store',(store={})=>{
			// if we haven't grabbed the dictionary yet, or if the dictionary selection for the room has changed then getDictionary.
			if(!this.App.game.dictionary || this.App.game.store.dictionary !== store.dictionary) { 
				this.App.setGetters.getDictionary(store.dictionary); 
			};

			this.App.setGetters.setStore(store);
		});

		this.data.listenToData();
	}
}

module.exports = Initialisation;