import React, { Component } from 'react';
import FormInput from './FormInput';
import FormEmail from './FormEmail';
import FormTextarea from './FormTextarea';

export default class Mailer extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div className="wrapper--noscores">
				<h1 className="beta">Contact</h1>
				<a href="/" className="header__home-link">← Back to lobby</a>
				<form action="" method="post" encType="multipart/form-data" className="form--contact">
					<div className="form__items">
						<FormInput name="name" label="Name"  placeholder="John Cena"/>
						<FormEmail name="email" label="Email address"  placeholder="JohnCena@gmail.com"/>
						<FormTextarea name="message" rows="10" label="Message"  placeholder="Your game doesn't work in the following ways..."/>
						<button className="btn--primary">Submit</button>
					</div>
				</form>
			</div>
		)
	}
}