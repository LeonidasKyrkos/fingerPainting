import React, { Component } from 'react';


export default class Footer extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<footer className="footer">
				<div className="footer__left">
					For bug reports and requests please email <a className="email-link" href="mailto:fingerpainting.io@gmail.com">fingerpainting.io@gmail.com</a>
				</div>
				<div className="footer__right">
					Hosted by <a href="http://redsnapper.net" className="email-link">Redsnapper Ltd.</a>
				</div>				
			</footer>
		)
	}
}