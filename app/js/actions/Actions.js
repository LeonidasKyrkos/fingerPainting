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
}

export default alt.createActions(Actions);