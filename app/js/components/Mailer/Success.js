import React, { Component } from 'react';

export default class Success extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div className="wrapper--noscores">
				<h1 className="beta">Success!</h1>
				<a href="/" className="header__home-link">← Back to lobby</a>
				<p>Thank you for your message.</p>
				<br/>
				<br/>
				<br/>
			</div>
		)
	}
}