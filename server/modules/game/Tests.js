// Class for testing various states and returning boolean responses

class Tests {
	constructor(App) {
		this.App = App;
		this.App.game = this.App.game;
		this.App.game.store = this.App.game.store;
	}

	testForPainter(id) {
		return this.App.game.store.players && this.App.game.store.players[id] && this.App.game.store.players[id].status === 'painter';
	}
}

module.exports = Tests;