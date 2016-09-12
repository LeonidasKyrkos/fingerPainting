import React, { Component } from 'react';
import Store from '../../stores/Store';
import RoomsList from './RoomsList';
import RoomSpawn from './RoomSpawn';
import Header from '../../Generic/Header';

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

	shouldComponentUpdate() {
		return false;
	}

	onChange(state) {
		this.setState(state);
	}

	render() {
		return (
			<main className="wrapper--noscores">
				<Header />
				<span className="small--it">Fingerpainting is currently only stable(ish) on Google Chrome. Bug reports will be rewarded with pleasant response emails.</span>
				<br/>
				<br/>
				<br/>
				<h2 className="gamma">Join a room</h2>
				<RoomsList />
			</main>
		);
	}
}