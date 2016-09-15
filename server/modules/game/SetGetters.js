// Setting and getting handler

class SetGetters {
	constructor(App) {
		this.App = App;
	}

	setStore(store={}) {
		// Not storing the paths remotely so just cloning them onto each new store as they come through.
		store.paths = _.clone(this.store.paths);
		this.App.store = store;

		// Emit event informing the application that the store has been altered
		this.App.events.emit('store updated');
	}

	getDictionary(dictionary='default') {
		let promise = this.App.data.getDictionary(dictionary);

		promise.then((snapshot)=>{
			this.App.game.dictionary = [];
			this.App.game.dictionaryObj = snapshot;

			// make an array out of our dictionary object and lowercase everything.
			for(let word in this.dictionaryObj) {
				this.App.game.dictionary.push(word.toLowerCase());
			}

			this.App.game.dictionaryBackup = this.App.dictionary.slice(0);
		});	
	}
}

module.exports = SetGetters;