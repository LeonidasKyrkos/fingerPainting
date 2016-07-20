import React, { Component } from 'react';

import Store from '../stores/Store';
import Users from './Users.js';
import Canvas from './Canvas.js';
import Chat from './Chat.js';

export default class Home extends Component {
	render() {
		return (
			<div className="wrapper">
				<h1 className="alpha">Pictionareo</h1>
				<Users userId={this.props.userId} />
				<div className="innerwrapper">					
					<Canvas />
					<Chat />
				</div>
			</div>
		);
	}
}