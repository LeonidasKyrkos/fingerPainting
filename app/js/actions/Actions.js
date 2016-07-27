import alt from '../alt';

class Actions {
	updateStore(data) {
		return data;
	}

	updateSocket(socket) {
		return socket;
	}

	updateUser(user) {
		return user;
	}

	updatePuzzle(puzzle) {
		return puzzle;
	}
}

export default alt.createActions(Actions);