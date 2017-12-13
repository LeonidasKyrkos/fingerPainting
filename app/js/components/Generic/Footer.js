import React, { Component } from 'react';


export default class Footer extends Component {
	constructor() {
		super();
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return (
			<footer className="footer">
				<div className="footer__left">
					If you notice any bugs and would like to let me know about them then please use <a href="/contact" className="email-link">the contact form</a>!
				</div>		
			</footer>
		)
	}
}