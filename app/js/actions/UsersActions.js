import alt from '../alt';
import firebase from 'firebase';

class UsersActions {
	updateUsers(users) {
		return users;
	}

	bindToRoom(room) {
		room.on('value',(snapshot)=>{
			this.actions.updateUsers(snapshot.val());
		});
	}
}

export default alt.createActions(UsersActions);