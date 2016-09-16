// Handles player state

class PlayerHandler {
	constructor(App) {
		this.App = App;
		this.game = this.App.game;
		this.store = this.game.store;
	}

	// New player request from client
	newPlayer(player={},socket={}) {
		this.game.sockets[player.id] = socket;

		if(this.game.inactivePlayers[player.refreshToken]) {
			this.reinstantiatePlayer(player);
		}

		if(!this.game.store.players) {
			player.status = 'painter';
		}

		this.App.events.emit('new player',{socket: socket, player: player});
		this.playerEventHandlers(socket, player);
	}

	// Add event handlers to new player's socket instance
	playerEventHandlers(socket={}, player={}) {
		socket.on('path update',(paths)=>{
			this.App.events.emit('path update',paths);
		});

		socket.on('start round',()=>{
			this.App.events.emit('start round');
		});

		socket.on('message',(msg)=>{
			this.App.events.emit('message',msg);
		});

		socket.on('disconnect',()=>{
			this.handleDisconnect(player.id);
		});
	}

	// Reinstantiate the player who has reconnected and give them back their score.
	reinstantiatePlayer(player={}) {
		player.score = this.game.inactivePlayers[player.refreshToken].score;

		this.removeInactivePlayer(player);
	}

	// Remove inactive player [part of garbage collection]
	removeInactivePlayer(player={}) {
		delete this.game.inactivePlayers[player.refreshToken];
	}

	// Function handler for client disconnection
	handleDisconnect(playerId) {
		if(!this.game.store.players) { return };
		let player = this.game.store.players[playerId];

		if(player.status === 'painter' && this.game.store.status === 'playing') {
			this.App.setGetters.addToGarbage();
			this.App.events.emit('end round');
			return;
		}

		if(player.status === 'painter') {
			this.App.events.emit('new painter required');
		}

		this.removePlayerFromGame(player);

		if(this.game.store.players && Object.keys(this.game.store.players).length <= this.game.minimumPlayers) {
			this.App.events.emit('end round');
		}
	}

	// Delete player from relevant areas and add them to the inactive players object
	removePlayerFromGame(player) {
		this.App.data.removePlayer(player.id);
		delete(this.game.sockets[player.id]);
		this.moveToInactive(player);
	}

	// Add player to inactive players object
	moveToInactive(player) {
		this.game.inactivePlayers[player.refreshToken] = _.clone(player);
	}

	rewardPlayers(player) {
		let score = player.score || 0;

		// give the guesser points based on the current game time
		this.App.data.updatePlayer(playerId,{ score: score + this.game.timer });

		// make array of players that are correct
		let correctPlayers = _.filter(this.store.players,(player)=>{
			return player.correct;
		});

		// if this is the first correct answer then reward the painter based on
		// the remaining time equal to that of the guesser
		if(correctPlayers.length === 1) {
			let artist = _.find(this.store.players,{status: 'painter'});
			this.App.data.updatePlayer(artist.id,{ score: score + this.game.timer });
		}

		// if there are as many correct players as there can be then end the round
		if(correctPlayers.length >= Object.keys(this.store.players).length - 1) {
			this.endRound();
		}
	}


	// HELPERS

	garbageCollection() {
		this.game.garbageQueue.forEach((player,index)=>{
			this.removePlayerFromGame(player);
			this.game.garbageQueue.splice(index, 1);
		});
	}
}

module.exports = PlayerHandler;