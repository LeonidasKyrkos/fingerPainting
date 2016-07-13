import React, { Component, PropTypes } from 'react';
import UsersStore from '../stores/UsersStore';

export default class Users extends Component {
	constructor(props) {
		super(props);

		this.state = UsersStore.getState();
	}

	componentDidMount() {
		UsersStore.listen(this.onChange.bind(this));
	}

	componentWillUnmount() {
		UsersStore.unlisten(this.onChange.bind(this));
	}

	onChange(state) {
		this.setState(state);
	}

	render() {
		let users = Object.keys(this.state.users).map((user,index)=>{
			let status = this.state.users[user].status === 'captain' ? '*' : '';

			return <li key={user}>{status + ' ' + this.state.users[user].name}</li>
		});

		return (
			<ul className="users__list">
				{users}
			</ul>
		)
	}
}