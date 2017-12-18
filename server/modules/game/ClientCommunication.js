const _ = require('lodash');

// client communication handler

class ClientCommunication {
	constructor(App) {
		this.App = App;
		this.App.game = this.App.game;
		this.App.game.store = this.App.game.store;
	}

	emitToSocket(socket,type,data) {
		socket.emit(type,data);
	}

	// Emit information to all players that are currently in an 'incorrect' state
	emitToStupidPlayers(type, emission) {
		const players = this.App.game.store.players;

		Object.keys(players).forEach(playerName => {
			const player = players[playerName];

			if(player.status !== 'painter' && !player.correct) {
				this.App.game.sockets[playerName].emit(type, emission);
			}
		});
	}

	emitToAllSockets(type,emission) {
		let sockets = this.App.game.sockets || {};

		for(let socket in sockets) {
			sockets[socket].emit(type, emission);
		};
	}

	emitToPainter(type,emission) {
		let painter = _.find(this.App.game.store.players,{ status: 'painter' });

		if(painter) {
			this.App.game.sockets[painter.id].emit(type,emission);
		}
	}

	/**
	 * Emit state to all players who are still guessing (excludes people who have guessed correctly)
	 * @param {String} type
	 * @param {} payload
	 */
	emitToGuessers(type, emission) {
		for (let player in this.App.game.store.players) {
			let playerObj = this.App.game.store.players[player];

			if(playerObj.status !== 'painter' && !playerObj.correct) {
				this.App.game.sockets[player].emit(type,emission);
			}
		}
	}

	/**
	 * Emit state to all players who are not the painter
	 * @param {String} type
	 * @param {} payload
	 */
	emitToAllGuessers(type, emission) {
		for (let player in this.App.game.store.players) {
			let playerObj = this.App.game.store.players[player];

			if(playerObj.status !== 'painter') {
				this.App.game.sockets[player].emit(type,emission);
			}
		}
	}

	updateClientPlayerObject() {
		for(let id in this.App.game.sockets) {
			for(let playerId in this.App.game.store.players) {
				if(id === playerId) {
					this.App.game.sockets[id].emit('player',this.App.game.store.players[playerId]);
				}
			}
		}
	}

	clearNotification() {
		this.App.clientComms.emitToAllSockets('notification',{
			text: '', 
			type: 'default'
		});
	}
}

module.exports = ClientCommunication;