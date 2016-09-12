import React, { Component } from 'react';

export default class Header extends Component {
	constructor() {
		super();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	render() {
		return (
			<header className="header">
				<h1 className="alpha">finger painting</h1>
			</header>
		)
	}
}