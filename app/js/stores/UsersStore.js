import alt from '../alt';
import UsersActions from '../actions/UsersActions';

class UsersStore {
	constructor() {
		this.Users = {};		

		this.bindListeners({
			handleUpdateUsers: UsersActions.UPDATE_USERS
		})
	}

	handleUpdateUsers(Users) {
		this.Users = Users;
	}
}

export default alt.createStore(UsersStore, 'UsersStore');