import React, { Component, PropTypes } from 'react';

export default class RenderOptions extends Component {
	constructor(props) {
		super(props);
	}

	renderOptions() {
		let obj = this.props.obj || {};
		let props = Object.keys(obj);

		return props.map((prop,index)=>{
			return <option key={index} value={prop}>{prop}</option>
		});
	}

	onChange() {
		// avoid unnecessary console logging
	}

	render() {
		let scope = this.props.scope || this;
		let onChange = this.props.onChange ? this.props.onChange.bind(scope) : this.onChange();
		let content = this.renderOptions();

		return (
			<label className="form__control">
				<span className="form__select-wrap">
					<select className="form__select" id={this.props.name} onChange={onChange} name={this.props.name} defaultValue={this.props.defaultVal}>
						{content}
					</select>
				</span>				
			</label>			
		)
	}
}