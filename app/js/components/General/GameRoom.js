import React, { Component } from 'react';

import Store from '../../stores/Store';
import Players from './Players.js';
import CanvasPlayer from '../Player/CanvasPlayer.js';
import CanvasClient from '../Client/CanvasClient.js';
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

	calcReturnItems() {
		if(this.state.store.status === 'finished') {
			return (
				<div className="game__wrap">
					<EndGame />
				</div>
			)
		}

		if(this.state.player.status === 'painter') {
			var canvas = <CanvasPlayer />
		} else {
			var canvas = <CanvasClient />
		}

		return (
			<div>					
				<div className="game__wrap">
					<Puzzle />			
					{canvas}
					<Chat />
				</div>	
				<Players />
			</div>	
		)
	}

	renderItems() {
		let returnItems = this.calcReturnItems();
		return returnItems;
	}

	render() {
		return (
			<div className="wrapper">
				<h1 className="gamma">{this.state.store.title}</h1>
				<a href="/" className="header__home-link">Back to lobby</a>
				{this.renderItems()}
			</div>
		);
	}
}