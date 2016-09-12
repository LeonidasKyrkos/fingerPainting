import React, { Component, PropTypes } from 'react';

export default class FormTextarea extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		/** @type {string} = label content */
		let label = this.props.label;

		/** @type {string} = placeholder content*/
		let placeholder = this.props.placeholder;

		/** @type {string} = input name content*/
		let name = this.props.name;

		return (
			<label className="form__control">
				<span className="form__label">{label}</span>
				<div className="form__input-wrap">
					<textarea id={name} name={name} rows={this.props.rows} type="email" placeholder={placeholder} className="form__input"/>
				</div>
			</label>
		)
	}
}

FormTextarea.propTypes = {
	label: PropTypes.string,
	placeholder: PropTypes.string,
	rows: PropTypes.string
}