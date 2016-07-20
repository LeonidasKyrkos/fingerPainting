import React, { Component } from 'react';

import Users from './Users.js';
import Canvas from './Canvas.js';
import Chat from './Chat.js';
import ClientConfigStore from '../stores/ClientConfigStore';

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