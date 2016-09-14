// initialisation methods for Game.js

function initialisation() {
	//delete any player records that have remained in the DB
	this.data.resetPlayers();
	attachDataListener.bind(this);
}

function attachDataListener() {
	e.on('store',(store={})=>{
		// if we haven't grabbed the dictionary yet, or if the dictionary selection for the room has changed then getDictionary.
		if(!this.game.dictionary || this.game.store.dictionary !== store.dictionary) { 
			this.getDictionary(store.dictionary); 
		};

		this.updateStore(store);
	});

	this.data.listenToData();
}

module.exports = initialisation;