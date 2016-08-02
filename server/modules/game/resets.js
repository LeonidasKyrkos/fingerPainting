// game resets

function resetGame() {
	this.database.update({
		status: 'pending'
	});

	this.resetPaths();
	this.cleverSailors = 0;
	this.resetClock();
	this.resetCorrectStatus();
	this.emitToAllSockets('puzzle',[]);
}

function resetPaths() {
	this.database.child('paths').remove();
}

function resetCorrectStatus() {
	if(this.store.users) {
		let users = this.store.users;
		let usersArr = Object.keys(users) || [];

		usersArr.forEach((username,index)=>{
			this.database.child('users').child(username).update({
				correct: false
			})
		});
	}
}

function resetClock() {
	this.timer = this.gameLength;
	this.database.update({
		clock: this.timer
	})
}

function resetRoom() {
	this.resetGame();
	this.resetUsers();
	this.roundCount = 1;
	this.resetChatlog();
}

function resetUsers() {
	let users = this.store.users;
	
	for(let user in users) {
		this.database.child('users').child(user).update({
			correct: false,
			score: 0
		})
	}
}

function resetChatlog() {
	this.database.child('chatLog').remove();
}

module.exports = {
	resetGame: resetGame,
	resetPaths: resetPaths,
	resetCorrectStatus: resetCorrectStatus,
	resetClock: resetClock,
	resetRoom: resetRoom,
	resetUsers: resetUsers,
	resetChatlog: resetChatlog
}