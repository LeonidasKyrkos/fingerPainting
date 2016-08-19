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

	render() {
		let scope = this.props.scope || this;
		let onChange = this.props.onChange ? this.props.onChange.bind(scope) : console.log(`no onchange func bound to RenderOptions`);
		let content = this.renderOptions();

		return (
			<label className="form__control">
				<span className="form__select-wrap">
					<select className="form__select" onChange={onChange} name={this.props.name} defaultValue={this.props.defaultValue}>
						{content}
					</select>
				</span>				
			</label>			
		)
	}
}