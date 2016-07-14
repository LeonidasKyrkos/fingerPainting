import React, { Component, PropTypes } from 'react';
import ErrorActions from '../actions/ErrorActions';
import ErrorStore from '../stores/ErrorStore';
import ClientConfigStore from '../stores/ClientConfigStore';

export default class ErrorMessage extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.onChange = this.onChange.bind(this);
		this.configChange = this.configChange.bind(this);
		this.state.errors = '';
		this.state.config = ClientConfigStore.getState().config;

		if(this.state.config && this.state.config.socket) {
			this.state.config.socket.on('request rejected',(data)=>{
				ErrorActions.updateErrors(data.errors);
			});
		}
	}

	componentDidMount() {
		ClientConfigStore.listen(this.configChange);
		ErrorStore.listen(this.onChange);
	}

	componentWillUnmount() {
		ErrorStore.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	configChange(state) {
		this.setState(state);
	}

	render() {
		return(
			<span className="form__error">{this.state.errors}</span>
		)
	}
}