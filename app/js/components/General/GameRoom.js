import React, { Component } from 'react';

import Store from '../../stores/Store';
import Players from './Players.js';
import CanvasPlayer from '../Player/CanvasPlayer.js';
import CanvasClient from '../Client/CanvasClient.js';
import Chat from './Chat.js';
import Puzzle from './Puzzle.js';
import EndGame from './Endgame';
import { roomStatusChangeTest, hasPlayerStatusUpdated } from '../../utilities/general';

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

	shouldComponentUpdate(nextProps, nextState) {
		return roomStatusChangeTest(this.state,nextState) || hasPlayerStatusUpdated(this.state,nextState);
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

		let canvas = this.state.player.status === 'painter' ? <CanvasPlayer /> : <CanvasClient />

		return (
			<div className="game__outerwrap">					
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
		return this.calcReturnItems();
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