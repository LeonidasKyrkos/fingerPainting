// client communication handler

class ClientCommunication {
	constructor(App) {
		this.App = App;
	}

	emitToSocket(socket,type,data) {
		socket.emit(type,data);
	}

	emitToAllSockets() {
		let sockets = this.App.game.sockets || {};

		for(let socket in sockets) {
			sockets[socket].emit(type, emission);
		};
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
}

module.exports = ClientCommunication;