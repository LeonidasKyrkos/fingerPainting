import React, { Component } from 'react';

import Store from '../stores/Store';
import Players from './Players.js';
import Canvas from './Canvas.js';
import Chat from './Chat.js';
import Puzzle from './Puzzle.js';
import EndGame from './Endgame';

export default class Home extends Component {
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

	renderItems() {
		if(this.state.store.status === 'finished') {
			return (
				<div className="game__wrap">
					<EndGame />
				</div>
			)
		} else {
			return (
				<div>					
					<div className="game__wrap">
						<Puzzle />			
						<Canvas />
						<Chat />
					</div>	
					<Players userId={this.props.userId} />
				</div>						
			)
		}
	}

	render() {
		return (
			<div className="wrapper">
				<h1 className="gamma">finger painting</h1>
				{this.renderItems()}
			</div>
		);
	}
}