import alt from '../alt';
import Actions from '../actions/Actions';
import App from '../components/App';

class Store {
	constructor() {
		this.store = {};
		this.socket = {};
		this.puzzle = '';
		this.error = '';

		this.bindListeners({
			handleUpdateStore: Actions.UPDATE_STORE,
			handleUpdateSocket: Actions.UPDATE_SOCKET,
			handleUpdateUser: Actions.UPDATE_USER,
			handleUpdatePuzzle: Actions.UPDATE_PUZZLE,
			handleUpdateError: Actions.UPDATE_ERROR
		})
	}

	handleUpdateStore(data) {
		this.store = data;
	}

	handleUpdateSocket(socket) {
		this.socket = socket;
	}

	handleUpdateUser(user) {
		this.user = user;
	}

	handleUpdatePuzzle(puzzle) {
		this.puzzle = puzzle;
	}

	handleUpdateError(error) {
		this.error = error;
	}
}

export default alt.createStore(Store, 'Store');