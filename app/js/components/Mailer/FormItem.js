import React, { Component } from 'react';

export default class FormItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<label className="form__control">
				<span className="form__label"></span>
				<div className="form__input-wrap">
					<input type="text" className="form__input"/>
				</div>
			</label>
		)
	}
}