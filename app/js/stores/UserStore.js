import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
	constructor() {
		this.user = {};

		this.bindListeners({
			handleUpdateUser: UserActions.UPDATE_USER
		})
	}

	handleUpdateUser(user) {
		this.user = user;
	}
}

export default alt.createStore(UserStore, 'UserStore');