import React, { Component } from 'react';
import ContactForm from './ContactForm';
import FormItem from './FormItem';

export default class Mailer extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div className="wrapper--noscores">
				<h1 className="beta">Contact</h1>
				<form action="" method="post">
					<div className="form__items">
						<FormItem />			
					</div>
				</form>
			</div>
		)
	}
}