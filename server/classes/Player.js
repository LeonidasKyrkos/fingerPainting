class Player {
	constructor(request,socket) {
		this.name = request.name,
		this.id = socket.userId,
		this.gameroom = request.id,
		this.correct = false,
		this.status = 'sailor'
	}
}

module.exports = Player;