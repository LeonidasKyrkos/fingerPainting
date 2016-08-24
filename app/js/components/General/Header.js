import React, { Component } from 'react';

export default class Header extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<header className="header">
				<h1 className="header__title">finger painting</h1>
				<span className="header__steve"></span>
			</header>
		)
	}
}