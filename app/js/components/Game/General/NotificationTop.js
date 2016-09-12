import React, { Component, PropTypes } from 'react';

export default class NotificationTop extends Component {
	constructor() {
		super();
	}

	componentDidMount() {
		this.refs.notificationTop.className += ' active';
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	close(e) {
		this.refs.notificationTop.parentNode.removeChild(this.refs.notificationTop);
	}

	render() {
		return (
			<div ref="notificationTop" className="notification--top">{ this.props.notification }<span onClick={this.close.bind(this)} className="notification--top__close"></span></div>
		)
	}
}

NotificationTop.propTypes = { notification: PropTypes.object };