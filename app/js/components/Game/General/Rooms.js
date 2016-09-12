import React, { Component } from 'react';

import Store from '../../stores/Store';

export default class Rooms extends Component {
	constructor() {
		super();

		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
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

	render() {
		if(this.state.socket.emit && !this.requested) {
			this.requested = true;
			this.state.socket.emit('rooms request');	
		}

		return (
			<div className="wrapper">
				<span className="alpha">Loading...</span>
			</div>			
		)
	}
}