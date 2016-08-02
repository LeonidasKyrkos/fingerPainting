class Player {
	constructor(request,socket) {
		this.request = request;
		this.socket = socket;
		this.player = this.setupPlayer();
	}

	setupPlayer() {
		return {
			name: this.request.name,
			id: this.socket.userId,
			gameroom: this.request.id,
			correct: false,
			status: 'sailor'
		}
	}
}

module.exports = Player;