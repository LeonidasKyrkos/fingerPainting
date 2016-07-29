import React, { Component } from 'react';
import Store from '../stores/Store';
import ErrorMessage from './ErrorMessage';

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

	render() {
		return (
			<div className="wrapper">
				<h1 className="alpha">finger painting</h1>
				<h2 className="beta">Join a room</h2>
				<form data-js="room.join" className="form" onSubmit={this.authenticate.bind(this)}>
					<ErrorMessage socket={this.state.socket} />
					<ul>
						<li>
							<label className="form__control">
								<span className="form__label">Name</span>
								<span className="form__input-wrap">
									<input maxLength="10" required data-js="room.name" autoComplete="off" type="text" className="form__input"/>
								</span>
							</label>
						</li>
						<li>
							<label className="form__control">
								<span className="form__label">Room number</span>
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