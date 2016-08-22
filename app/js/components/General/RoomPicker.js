import React, { Component } from 'react';
import Store from '../../stores/Store';
import RoomsLists from './RoomsList';
import RoomSpawn from './RoomSpawn';

export default class RoomPicker extends Component {
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

	render() {
		return (
			<div className="wrapper">
				<h1 className="alpha">finger painting</h1>
				<h2 className="beta">Join a room</h2>
				<RoomsLists />
			</div>
		);
	}
}