import React, { Component, PropTypes } from 'react';
import Store from '../stores/Store';

export default class ErrorMessage extends Component {
	constructor(props) {
		super(props);
		this.state = Store.getState();
		this.state.errors = '';

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

		this.state.socket.on('request rejected',(data)=>{
			this.state.errors = data.errors;
		});
	}

	render() {
		return(
			<span className="form__error">{this.state.errors}</span>
		)
	}
}