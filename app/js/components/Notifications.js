import React, { Component } from 'react';
import Store from '../stores/Store';

export default class Notifications extends Component {
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

	shouldComponentUpdate(nextProps,nextState) {
		let newMsg = nextState.notification.text;
		let oldMsg = this.state.notification.text;

		if(newMsg.length && newMsg !== oldMsg) {
			return true;
		} else {
			return false;
		}
	}

	onChange(state) {
		this.setState(state);
	}

	render() {
		let notification = this.state.notification;
		let classes = 'notification ' + notification.type;

		return (
			<div className={classes}>
				<span className="notification__text">{ notification.text }</span>				
			</div>
		)
	}
}