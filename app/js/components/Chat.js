import React, { Component } from 'react';

import Store from '../stores/Store';
import Message from './Message';
import { isEqual as _isEqual } from 'lodash';

export default class Chat extends Component {
	constructor() {
		super();

		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);		
	}

	componentDidMount() {
		Store.listen(this.onChange);
		this.scrollChat();
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	shouldComponentUpdate(nextProps,nextState) {
		return this.runUpdateTests(nextProps,nextState);
	}

	runUpdateTests(nextProps,nextState) {
		if (!_isEqual(nextProps,this.props)) {
			return true;
		}

		if(!_isEqual(nextState.store.chatLog,this.state.store.chatLog)) {
			return true;
		}

		return false;
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
			data.id = this.state.socket.id;
			data.name = this.state.store.players[data.id].name;
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

	scrollChat() {
		this.chatHistory = document.querySelector('#chat-history');
		if(this.chatHistory) { 
			this.chatHistory.scrollTop = this.chatHistory.scrollHeight; 
		};
	}

	renderForm() {
		return (
			<form className="form--chat" onSubmit={this.parseChatForm.bind(this)}>
				<input autoComplete="off" id="chat-input" type="text" className="form__input"/>
				<button className="btn--submit flex-right">»</button>
			</form>
		)
	}

	render() {
		this.chatLog = this.state.store.chatLog || {};
		this.chats = this.renderChats(this.chatLog);

		setTimeout(()=>{ this.scrollChat() },32);

		let form = this.renderForm();

		return (
			<div className="chat">
				<div id="chat-history" className="chat__history">
					{this.chats}
				</div>
				{form}
			</div>
		)
	}
}