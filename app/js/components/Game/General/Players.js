import React, { Component, PropTypes } from 'react';
import Store from '../../../stores/Store';
import { playerCountChangedTest } from '../../../utilities/general';

export default class players extends Component {
	constructor() {
		super();

		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
	}

	componentDidMount() {
		Store.listen(this.onChange);
		let audio = new Audio('/media/sound/335908__littlerainyseasons__correct.mp3');

		if(typeof this.state.socket.on === 'function') {
			this.state.socket.on('correct',()=>{
				audio.play();
			});
		}		
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
		//return playerCountChangedTest(this.state,nextState);
	}

	onChange(state) {
		this.setState(state);
	}

	getClassName(player) {
		let status = player.status;
		let correct = player.correct;
		let classname = '';

		if(status === 'painter') {
			classname += ' active';
		}

		if(player.name === this.state.player.name) {
			classname += ' player';
		}

		if(correct) {
			classname += ' correct';
		}

		return classname;
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
				let classname = 'players__player' + this.getClassName(player);

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
				<h3 className="delta tac">Scores</h3>
				<ul className="players__list">
					{this.renderPlayers()}
				</ul>
			</div>			
		)		
	}
}