import React, { Component } from 'react';

let socket = io.connect('http://localhost:3000');

export default class App extends Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}