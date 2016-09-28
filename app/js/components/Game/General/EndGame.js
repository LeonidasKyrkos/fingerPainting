import React, { Component } from 'react';
import Store from '../../../stores/Store';
import Scoreboard from './Scoreboard';
import Stats from './Stats';

export default class EndGame extends Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
	}

	componentDidMount() {
		Store.listen(this.onChange);
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	onChange(state) {
		this.setState(state);
	}
	
	render() {
		return (
			<div className="game__over">
				<h1 className="alpha">Game over! Here's how everyone did...</h1>
				<h2 className="beta">Final scores</h2>
				<Scoreboard />
			</div>
		);
	}
}