import React, { Component, PropTypes } from 'react';

import Store from '../stores/Store';
import Message from './Message';

export default class Chat extends Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
	}

	componentDidMount() {
		Store.listen(this.onChange);
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
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
			this.state.socket.emit('message',data)
		}
	}

	renderChats(chatLog) {
		return Object.keys(chatLog).map((item,index)=>{
			let chat = chatLog[item];
			return (
				<Message chat={chat} key={chat.timestamp} />
			)
		});
	}

	render() {
		const chatHistory = document.querySelector('#chat-history');

		let chatLog = this.state.store.chatLog;

		let chats = typeof chatLog !== 'undefined' ? this.renderChats(chatLog) : '';

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