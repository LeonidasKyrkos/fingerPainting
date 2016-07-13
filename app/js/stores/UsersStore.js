import alt from '../alt';
import UsersActions from '../actions/UsersActions';

class UsersStore {
	constructor() {
		this.users = '';

		this.bindListeners({
			handleUpdateUsers: UsersActions.UPDATE_USERS
		})
	}

	handleUpdateUsers(users) {
		this.users = users;
	}
}

export default alt.createStore(UsersStore, 'UsersStore');