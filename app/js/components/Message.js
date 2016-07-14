import React, { Component, PropTypes } from 'react';

export default class Message extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let chat = this.props.chat;

		return(
			<div key={chat.timestamp} className="chat__msg-wrap">
				<span className="chat__label">{chat.name}:</span><span className="chat__text">{chat.message}</span>	
			</div>			
		)
	}
}