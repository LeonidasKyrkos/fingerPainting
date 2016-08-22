import React, { Component } from 'react';
import Store from '../../stores/Store';
import Scoreboard from './Scoreboard';

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

	onChange(state) {
		this.setState(state);
	}
	
	render() {
		return (
			<div className="game__over">
				<h1 className="alpha">GAME OVER</h1>
				<Scoreboard />
			</div>
		);
	}
}