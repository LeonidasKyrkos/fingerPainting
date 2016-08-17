import React, { Component } from 'react';
import Store from '../stores/Store';
import ErrorMessage from './ErrorMessage';

export default class RoomJoin extends Component {
	constructor() {
		super();

		this.state = Store.getState();
	}

	authenticate(e) {
		e.preventDefault();

		let form = {};
		form.el = e.target;
		form.id = form.el.querySelector('[data-js="room.id"]').value;
		form.password = form.el.querySelector('[data-js="room.password"]').value;
		form.name = form.el.querySelector('[data-js="room.name"]').value;

		this.requestJoin(form.name,form.id,form.password);
	}

	requestJoin(name,id,password) {
		this.state.socket.emit('join request',{ name: name, id: id, password: password });
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	render() {
		return (
			<form data-js="room.join" className="form" onSubmit={this.authenticate.bind(this)}>
				<ErrorMessage socket={this.state.socket} />
				<ul>
					<li>
						<label className="form__control">
							<span className="form__label">Username</span>
							<span className="form__input-wrap">
								<input maxLength="10" required data-js="room.name" autoComplete="off" type="text" className="form__input"/>
							</span>
						</label>
					</li>
					<li>
						<label className="form__control">
							<span className="form__label">Room name</span>
							<span className="form__input-wrap">
								<input required data-js="room.id" autoComplete="off" type="text" className="form__input"/>
							</span>
						</label>
					</li>
					<li>
						<label className="form__control">
							<span className="form__label">Password</span>
							<span className="form__input-wrap">
								<input required data-js="room.password" type="password" className="form__input"/>
							</span>
						</label>
					</li>
					<li className="align-right">
						<button className="btn--primary">Submit</button>
					</li>
				</ul>
			</form>
		)
	}
}