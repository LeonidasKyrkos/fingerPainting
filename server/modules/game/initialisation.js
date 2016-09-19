// initialisation class for Game.js

class Initialisation {
	constructor(App) {
		this.App = App;
		this.data = this.App.data;
		this.events = this.App.events;

		this.init();
	}

	init() {
		this.data.resetPlayers();
		this.data.resetStoreStatus();
		this.attachDataListener();
	}

	attachDataListener() {
		this.events.on('store_received',(store={})=>{
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