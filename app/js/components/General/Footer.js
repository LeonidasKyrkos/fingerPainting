import React, { Component } from 'react';


export default class Footer extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<footer className="footer">For bug reports and requests please email <a className="email-link" href="mailto:fingerpainting.io@gmail.com">fingerpainting.io@gmail.com</a></footer>
		)
	}
}