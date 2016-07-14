import alt from '../alt';
import firebase from 'firebase';

class ChatActions {
	updateChatLog(chatLog) {
		return chatLog;
	}

	bindToFirebase(ref) {
		ref.on('value',(snapshot)=>{
			let data = snapshot.val();

			if(data) {
				this.actions.updateChatLog(data);
			}
		});
	}
}

export default alt.createActions(ChatActions);