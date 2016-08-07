class Player {
	constructor(request,socket,cookie) {
		this.name = request.name,
		this.id = socket.userId,
		this.gameroom = request.id,
		this.correct = false,
		this.status = 'guesser',
		this.score = 0,
		this.refreshToken = cookie;
	}
}

module.exports = Player;