import React, { Component } from 'react';
import Store from '../../stores/Store';
import RoomsLists from './RoomsList';
import RoomSpawn from './RoomSpawn';
import Header from './header';

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
			<article className="wrapper--noscores">
				<Header />
				<h2 className="gamma">Join a room</h2>
				<RoomsLists />
			</article>
		);
	}
}