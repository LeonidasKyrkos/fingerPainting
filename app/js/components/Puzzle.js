import React, { Component } from 'react';
import Store from '../stores/Store';

export default class Puzzle extends Component {
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
		return (
			<div className="game__top">
				<span className="game__puzzle">{this.state.puzzle}</span>
				<span className="game__timer">{this.state.store.clock}</span>				
			</div>			
		);
	}
}