import React, { Component, PropTypes } from 'react';
import UsersActions from '../actions/UsersActions';
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
		return (
			<ul className="users__list">
				{this.state.users}
			</ul>
		)
	}
}