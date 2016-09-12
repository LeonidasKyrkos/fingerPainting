import React, { Component } from 'react';
import Store from '../../stores/Store';

export default class Scoreboard extends Component {
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

	sortUsers() {
		let users = this.state.store.players || {};
		let usersArr = [];

		Object.keys(users).map((user,index)=>{
			usersArr.push(users[user]);
		});

		return usersArr.sort((a,b)=>{
			return b.score - a.score;
		});
	}

	renderUsers() {
		let users = this.sortUsers();
		let usersArr = Object.keys(users);

		return usersArr.map((item,index)=>{
			let user = users[item];
			let username = user.name;
			let score = user.score;

			return (
				<li key={item}>
					<div className="scoreboard__item">
						<span className="scoreboard__item-name">{username}</span>
						<span className="scoreboard__item-score">{score}</span>
					</div>					
				</li>
			)
		});
	}

	render() {
		return (
			<div>
				<ul className="scoreboard__items">
					{this.renderUsers()}
				</ul>				
			</div>
		);
	}
}