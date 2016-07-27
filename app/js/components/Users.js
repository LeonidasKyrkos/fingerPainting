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
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	getClassName(user) {
		let status = this.state.store.users[user].status;
		let correct = this.state.store.users[user].correct;

		if(status === 'captain') {
			return 'active';
		}

		if(correct) {
			return 'correct';
		}
	}

	render() {
		if(this.state.store.users) {
			let users = Object.keys(this.state.store.users).map((user,index)=>{
				let status = '';
				let classname = 'users__user ' + this.getClassName(user);

				return (
					<li key={user}>
							<span className={classname}>
								{this.state.store.users[user].name}
							</span>						
					</li>
				)
			});

			return (
				<ul className="users__list">
					{users}
				</ul>
			)
		}
	}
}