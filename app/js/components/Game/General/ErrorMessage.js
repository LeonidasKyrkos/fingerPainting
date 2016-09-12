import React, { Component, PropTypes } from 'react';
import Store from '../../../stores/Store';

export default class ErrorMessage extends Component {
	constructor() {
		super();

		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);		
	}

	componentDidMount() {
		Store.listen(this.onChange);
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	shouldComponentUpdate(nextProps,nextState) {
		return nextState.error !== this.state.error;
	}

	render() {
		return(
			<span className="form__error">{this.state.error}</span>
		)
	}
}