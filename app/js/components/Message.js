import React, { Component, PropTypes } from 'react';
import Store from '../stores/Store';

export default class Message extends Component {
	constructor() {
		super();

		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);		
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

	render() {
		let chat = this.props.chat;
		let classname = this.state.socket.id === chat.id ? "chat__msg-wrap active" : "chat__msg-wrap";

		return(
			<div key={chat.timestamp} className={classname}>
				<span className="chat__label">{chat.name}:</span><span className="chat__text">{chat.message}</span>	
			</div>			
		)
	}
}