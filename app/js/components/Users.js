import React, { Component, PropTypes } from 'react';
import Store from '../stores/Store';

export default class Users extends Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
	}

	componentDidMount() {
		Store.listen(this.onChange);
		this.attachKeyBinding();
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
		this.detachKeyBinding();
	}

	onChange(state) {
		this.setState(state);
	}

	getClassName(user) {
		let status = user.status;
		let correct = user.correct;

		if(status === 'captain') {
			return 'active';
		}

		if(correct) {
			return 'correct';
		}
	}

	attachKeyBinding() {
		this.users = document.querySelector('[data-js="users"]');

		if(this.users) {
			window.addEventListener('keydown',this.openUsers.bind(this));
			window.addEventListener('keyup',this.closeUsers.bind(this));
		}
	}

	detachKeyBinding() {
		window.removeEventListener('keydown',this.openUsers.bind(this));
		window.removeEventListener('keyup',this.closeUsers.bind(this));
	}

	openUsers(e) {
		if(e.keyCode === 9) {
			e.preventDefault();
			this.users.className = "users active";
		}
	}

	closeUsers(e) {
		if(e.keyCode === 9) {
			e.preventDefault();
			this.users.className = "users";
		}
	}

	sortUsers() {
		let users = this.state.store.users || {};
		let usersArr = [];

		Object.keys(users).map((user,index)=>{
			usersArr.push(users[user]);
		});

		return usersArr.sort((a,b)=>{
			return b.score - a.score;
		});
	}

	renderUsers() {
		if(this.state.store.users) {
			let users = this.sortUsers();
			let usersArr = Object.keys(users);

			return usersArr.map((username,index)=>{
				let user = users[username];
				let classname = 'users__user ' + this.getClassName(user);

				return (
					<li key={user.name}>
							<span className={classname}>
								<span className="users__user-name">{user.name}</span>
								<span className="users__user-score">{user.score}</span>								 
							</span>						
					</li>
				)
			});
		}
	}

	render() {
		return (
			<div data-js="users" className="users">
				<h3 className="gamma">Current scores</h3>
				<ul className="users__list">
					{this.renderUsers()}
				</ul>
			</div>			
		)		
	}
}