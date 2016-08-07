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

	updatePuzzle(puzzleArray) {
		return puzzleArray;
	}

	updateError(error) {
		return error;
	}

	updateDictionarys(dictionarys) {
		return dictionarys;
	}

	updatePlayerStatus(playerStatus) {
		return playerStatus;
	}

	updatePlayer(player) {
		return player;
	}
}

export default alt.createActions(Actions);