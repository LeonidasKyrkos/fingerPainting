import React, { Component } from 'react';

import Users from './Users.js';

export default class Home extends Component {
	render() {
		return (
			<div className="wrapper">
				<h1 className="alpha">Pictionareo</h1>
				<Users />
			</div>
		);
	}
}