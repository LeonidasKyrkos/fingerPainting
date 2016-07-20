import React, { Component, PropTypes } from 'react';
import Store from '../stores/Store';

export default class Users extends Component {
	constructor(props) {
		super(props);

		this.state = Store.getState();
	}

	componentDidMount() {
		Store.listen(this.onChange.bind(this));
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange.bind(this));
	}

	onChange(state) {
		this.setState(state);
	}

	render() {
		let users = Object.keys(this.state.store.users).map((user,index)=>{
			let status = '';
			let classname = 'users__user';
			if(this.state.store.users[user].status === 'captain') {
				status = '*';
				classname += ' active';
			}

			return (
				<li key={user}>
						<span className={classname}>
							{status + ' ' + this.state.store.users[user].name}
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