import React, { Component } from 'react';
import Store from '../stores/Store';
import RoomJoin from './RoomJoin';
import RoomsLists from './RoomsList';

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
				<RoomJoin />
				<RoomsLists />
				<h2 className="beta">Spawn room</h2>
				<form data-js="room.spawn" className="form" onSubmit={this.authenticate}>
					<ul>
						<li>
							<label className="form__control">
								<span className="form__label">Name</span>
								<span className="form__input-wrap">
									<input data-js="room.username" autoComplete="off" type="text" className="form__input"/>
								</span>
							</label>
						</li>
						<li>
							<label className="form__control">
								<span className="form__label">Password</span>
								<span className="form__input-wrap">
									<input data-js="room.spawnPassword" type="password" className="form__input"/>
								</span>
							</label>
						</li>
						<li className="align-right">
							<button className="btn--primary">Spawn</button>
						</li>
					</ul>
				</form>
			</div>
		);
	}
}