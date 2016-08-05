import React, { Component, PropTypes } from 'react';
import Store from '../stores/Store';

export default class players extends Component {
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

	getClassName(player) {
		let status = player.status;
		let correct = player.correct;

		if(status === 'painter') {
			return 'active';
		}

		if(correct) {
			return 'correct';
		}
	}

	closeplayers(e) {
		if(e.keyCode === 9) {
			e.preventDefault();
			this.players.className = "players";
		}
	}

	sortPlayers() {
		let players = this.state.store.players || {};
		let playersArr = [];

		Object.keys(players).map((player,index)=>{
			playersArr.push(players[player]);
		});

		return playersArr.sort((a,b)=>{
			return b.score - a.score;
		});
	}

	renderPlayers() {
		let players = this.state.store.players;

		if(players) {
			let sortedPlayers = this.sortPlayers();
			let sortedPlayersArr = Object.keys(sortedPlayers);

			return sortedPlayersArr.map((item,index)=>{
				let player = sortedPlayers[item];
				let classname = 'players__player ' + this.getClassName(player);

				return (
					<li key={player.id}>
							<span className={classname}>
								<span className="players__name">{player.name}</span>
								<span className="players__score">{player.score}</span>								 
							</span>						
					</li>
				)
			});
		}
	}

	render() {
		return (
			<div data-js="players" className="players">
				<h3 className="gamma">Current scores</h3>
				<ul className="players__list">
					{this.renderPlayers()}
				</ul>
			</div>			
		)		
	}
}