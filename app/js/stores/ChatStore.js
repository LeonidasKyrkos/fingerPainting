import alt from '../alt';
import ChatActions from '../actions/ChatActions';

class ChatStore {
	constructor() {
		this.chatLog = [];

		this.bindListeners({
			handleUpdateChatLog: ChatActions.UPDATE_CHAT_LOG
		})
	}

	handleUpdateChatLog(chatLog) {
		this.chatLog = chatLog;
	}
}

export default alt.createStore(ChatStore, 'ChatStore');