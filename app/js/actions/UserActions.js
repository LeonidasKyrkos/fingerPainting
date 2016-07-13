import alt from '../alt';
import firebase from 'firebase';

class UserActions {
	updateUser(user) {
		return user;
	}
}

export default alt.createActions(UserActions);