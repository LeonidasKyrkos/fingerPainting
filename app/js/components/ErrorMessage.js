import React, { Component, PropTypes } from 'react';
import ErrorActions from '../actions/ErrorActions';
import ErrorStore from '../stores/ErrorStore';

export default class ErrorMessage extends Component {
	constructor(props) {
		super(props);

		this.state = ErrorStore.getState();

		this.props.socket.on('request rejected',(data)=>{
			ErrorActions.updateErrors(data.errors);
		});
	}

	componentDidMount() {
		ErrorStore.listen(this.onChange.bind(this));
	}

	componentWillUnmount() {
		ErrorStore.unlisten(this.onChange.bind(this));
	}

	onChange(state) {
		this.setState(state);
	}

	render() {
		return(
			<span className="form__error">{this.state.errors}</span>
		)
	}
}