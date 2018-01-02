// Handles player state

const _ = require('lodash');

class PlayerHandler {
	constructor(App) {
		this.App = App;
	}

	// New player request from client
	newPlayer(player={},socket={}) {
		this.App.game.sockets[player.id] = socket;

		if(this.App.game.inactivePlayers[player.refreshToken]) {
			this.reinstantiatePlayer(player);
		}

		if(!this.App.game.store.players) {
			player.status = 'painter';
		}

		this.App.events.emit('new_player',{ socket: socket, msg: player });
		this.playerEventHandlers(socket, player);
	}

	// Add event handlers to new player's socket instance
	playerEventHandlers(socket={}, player={}) {
		socket.on('path update',(paths)=>{
			this.App.events.emit('path_update',paths);
		});

		socket.on('start round',()=>{
			this.App.events.emit('start_round');
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
		player.score = this.App.game.inactivePlayers[player.refreshToken].score;

		this.removeInactivePlayer(player);
	}

	// Remove inactive player [part of garbage collection]
	removeInactivePlayer(player={}) {
		delete this.App.game.inactivePlayers[player.refreshToken];
	}

	// Function handler for client disconnection
	handleDisconnect(playerId) {
		if(!this.App.game.store.players) { return };

		let player = this.App.game.store.players[playerId];

		if(player.status === 'painter' && this.App.game.store.status === 'playing') {
			this.App.setGetters.addToGarbage(player);
			this.removePlayerFromGame(player);
			this.App.events.emit('end_round');
			return;
		}

		if(player.status === 'painter' && Object.keys(this.App.game.store.players).length > 1) {
			this.App.events.emit('new_painter_required');
		}

		this.removePlayerFromGame(player);

		if(this.App.game.store.players && Object.keys(this.App.game.store.players).length <= this.App.game.settings.minimumPlayers) {
			this.App.events.emit('end_round');
		}
	}

	// Delete player from relevant areas and add them to the inactive players object
	removePlayerFromGame(player) {
		this.App.data.removePlayer(player.id);
		delete(this.App.game.sockets[player.id]);
		this.moveToInactive(player);
	}

	// Add player to inactive players object
	moveToInactive(player) {
		this.App.game.inactivePlayers[player.refreshToken] = _.clone(player);
	}

	// give player points based on current timer state
	rewardPlayer(player) {
		this.App.data.updatePlayer(player.id,{ score: player.score + this.App.fingerPainting.timer });
	}

	resetPlayerScores() {
		if(this.App.game.store.players) {
			for(let player in this.App.game.store.players) {
				this.App.setGetters.setPlayerProperty(this.App.game.store.players[player],'score',0);
			}
		}
	}
	
	
	// HELPERS

	garbageCollection() {
		this.App.game.garbageQueue.forEach((player,index)=>{
			this.removePlayerFromGame(player);
			this.App.game.garbageQueue.splice(index, 1);
		});
	}	
}

module.exports = PlayerHandler;