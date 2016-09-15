// Handles player state

class PlayerHandler {
	constructor(App) {
		this.App = App;
		this.game = this.App.game;
	}

	newPlayer(player={},socket={}) {
		this.game.sockets[player.id] = socket;

		if(this.inactivePlayers[player.refreshToken]) {
			this.reinstantiatePlayer(player);
		}

		if(!this.game.store.players) {
			player.status = 'painter';
		}

		this.App.events.emit('new player',{socket: socket, player: player});
		this.playerEventHandlers(socket, player);
	}

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
			this.handleDisconnect(playerId);
		});
	}

	reinstantiatePlayer(player={}) {
		player.score = this.game.inactivePlayers[player.refreshToken].score;

		this.removeInactivePlayer(player);
	}

	removeInactivePlayer(player={}) {
		delete this.game.inactivePlayers[player.refreshToken];
	}

	handleDisconnect(playerId) {
		let player = this.game.store.players[playerId];

		if(player.status === 'painter' && this.game.store.status === 'playing') {
			this.App.events.emit('dump player',player);
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

	removePlayerFromGame(player) {
		this.App.data.removePlayer(player.id);
		delete(this.game.sockets[player.id]);
		this.moveToInactive(player);
	}

	moveToInactive(player) {
		this.game.inactivePlayers[player.refreshToken] = _.clone(player);
	}
}

module.exports = PlayerHandler;