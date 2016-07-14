import React, { Component, PropTypes } from 'react';

import UserStore from '../stores/UserStore';
import ClientConfigStore from '../stores/ClientConfigStore';
import ChatActions from '../actions/ChatActions';
import ChatStore from '../stores/ChatStore';
import Message from './Message';

export default class Chat extends Component {
	constructor(props) {
		super(props);

		this.userChange = this.userChange.bind(this);
		this.chatChange = this.chatChange.bind(this);

		let clientConfigStore = ClientConfigStore.getState().config;
		this.state = { chatLog: [], user: UserStore.getState().user, db: clientConfigStore.db, room: clientConfigStore.room};
	}

	componentDidMount() {
		UserStore.listen(this.userChange);
		ChatStore.listen(this.chatChange);
		ChatActions.bindToFirebase(this.state.db.ref(this.state.room + '/chatLog'));
	}

	componentWillUnmount() {
		UserStore.unlisten(this.userChange);
		ChatStore.unlisten(this.chatChange);
	}

	userChange(state) {
		this.setState(state);
	}

	chatChange(state) {
		this.setState(state);
	}

	parseChatForm(e) {
		e.preventDefault();
		let form = e.target;
		let input = form.querySelector('#chat-input');
		let msg = input.value;
		let chatHistory = document.querySelector('#chat-history');
		input.value = "";

		if(msg.length) {			
			let timestamp = (new Date()).getTime();
			let data = {};
			data.name = this.state.user.name;
			data.message = msg;
			data.timestamp = timestamp;

			// if(data.message === this.state.puzzle) {
			// 	input.value = "";
			// 	window.alert(`correct! well done ${this.state.userId}`);
			// } else {
				this.state.db.ref(this.state.room + '/chatLog').push(data);
			// }


		}
	}

	render() {
		const chatHistory = document.querySelector('#chat-history');

		let chatLog = this.state.chatLog;

		let chats = Object.keys(chatLog).map((item,index)=>{
			let chat = chatLog[item];
			return (
				<Message chat={chat} key={chat.timestamp} />
			)
		});

		console.log(chats);

		if(chatHistory) { 
			setTimeout(()=>{ chatHistory.scrollTop = chatHistory.scrollHeight},32); 
		};
		

		return (
			<div className="chat">
				<div id="chat-history" className="chat__history">
					{chats}
				</div>
				<form className="form--chat" onSubmit={this.parseChatForm.bind(this)}>
					<input autoComplete="off" id="chat-input" type="text" className="form__input"/>
					<button className="btn--submit flex-right">»</button>
				</form>
			</div>
		)
	}
}