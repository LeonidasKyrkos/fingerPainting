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
			<article className="wrapper">
				<header><h1 className="header__title">finger painting</h1><img src="/media/img/hand-small.png" alt="" className="header__logo"/></header>
				<h2 className="beta">Join a room</h2>
				<RoomsLists />
			</article>
		);
	}
}