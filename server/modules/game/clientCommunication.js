// client communication handler

class ClientCommunication {
	constructor(App) {
		this.App = App;
		this.game = this.App.game;
		this.store = this.game.store;
	}

	emitToSocket(socket,type,data) {
		socket.emit(type,data);
	}

	// Emit information to all players that are current in an 'incorrect' state
	emitToStupidPlayers(type,msg) {
		for(let player in this.store.players) {
			let playerObj = this.store.players[player];

			if(playerObj.status !== 'painter' && !playerObj.correct) {
				this.sockets[player].emit(type,clue);
			}
		}
	}

	emitToAllSockets(type,emission) {
		let sockets = this.App.game.sockets || {};

		for(let socket in sockets) {
			sockets[socket].emit(type, emission);
		};
	}

	emitToGuessers(type,emission) {
		for(let player in this.store.players) {
			let playerObj = this.store.players[player];

			if(playerObj.status !== 'painter' && !playerObj.correct) {
				this.game.sockets[player].emit(type,emission);
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