import React, { Component } from 'react';

import Store from '../stores/Store';
import Users from './Users.js';
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
					<Users userId={this.props.userId} />
					<div className="game__wrap">
						<Puzzle />			
						<Canvas />
						<Chat />
					</div>	
				</div>						
			)
		}
	}

	render() {
		return (
			<div className="wrapper">
				{this.renderItems()}
			</div>
		);
	}
}