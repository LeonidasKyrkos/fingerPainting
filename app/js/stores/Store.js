import alt from '../alt';
import Actions from '../actions/Actions';
import App from '../components/App';

class Store {
	constructor() {
		this.store = {};
		this.socket = {};
		this.puzzleArray = [];
		this.error = '';
		this.dictionarys = {};
		this.playerStatus = false;
		this.player = {};

		this.bindListeners({
			handleUpdateStore: Actions.UPDATE_STORE,
			handleUpdateSocket: Actions.UPDATE_SOCKET,
			handleUpdateUser: Actions.UPDATE_USER,
			handleUpdatePuzzleArray: Actions.UPDATE_PUZZLE,
			handleUpdateError: Actions.UPDATE_ERROR,
			handleUpdateDictionarys: Actions.UPDATE_DICTIONARYS,
			handleUpdatePlayerStatus: Actions.UPDATE_PLAYER_STATUS,
			handleUpdatePlayer: Actions.UPDATE_PLAYER
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

	handleUpdatePuzzleArray(puzzleArray) {
		this.puzzleArray = puzzleArray;
	}

	handleUpdateError(error) {
		this.error = error;
	}

	handleUpdateDictionarys(dictionarys) {
		this.dictionarys = dictionarys;
	}

	handleUpdatePlayerStatus(playerStatus) {
		this.playerStatus = playerStatus;
	}

	handleUpdatePlayer(player) {
		this.player = player;
	}
}

export default alt.createStore(Store, 'Store');