import React, { Component } from 'react';
import Store from '../../stores/Store';

export default class WaitingMsgClient extends Component {
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
		if(this.state.store.status && nextState.store.status !== this.state.store.status) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		if(this.state.store.status && this.state.store.status !== 'pending') { 
			var content = <span className="hide"></span>
		} else {
			var content = <span className="game__message">Waiting for Artist to start the game</span>
		}

		return content;
	}
}