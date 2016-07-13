import React, { Component } from 'react';

import Users from './Users.js';
import Canvas from './Canvas.js';

export default class Home extends Component {
	render() {
		return (
			<div className="wrapper">
				<h1 className="alpha">Pictionareo</h1>
				<Users userId={this.props.userId} />
				<Canvas userId={this.props.userId} />
			</div>
		);
	}
}