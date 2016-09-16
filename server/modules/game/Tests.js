// Class for testing various states and returning boolean responses

class Tests {
	constructor(App) {
		this.App = App;
		this.game = this.App.game;
		this.store = this.game.store;
	}

	testForPainter(id) {
		return this.store.players && this.store.players[id] && this.store.players[id].status === 'painter';
	}
}

module.exports = Tests;