import React, { Component } from 'react';
import ErrorActions from '../actions/ErrorActions';
import ErrorStore from '../stores/ErrorStore';

export default class RoomPicker extends Component {
	constructor(props) {
		super(props);

		this.requestJoin = this.props.requestJoin;
		this.state = ErrorStore.getState();

		socket.on('request rejected',(data)=>{
			console.log(data);
			//ErrorActions.updateErrors(data);
		});
	}

	componentDidMount() {
		ErrorStore.listen(this.onChange);
	}

	componentWillUnmount() {
		ErrorStore.unlisten(this.onChange);
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

	render() {
		return (
			<div className="wrapper">
				<h2 className="alpha">Join a room</h2>
				<form data-js="room.join" className="form" onSubmit={this.authenticate.bind(this)}>
					<span className="form__error">{this.state.errors}</span>
					<ul>
						<li>
							<label className="form__control">
								<span className="form__label">Name</span>
								<span className="form__input-wrap">
									<input required data-js="room.name" autoComplete="off" type="text" className="form__input"/>
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
									<input defaultValue={this.props.username} data-js="room.username" autoComplete="off" type="text" className="form__input"/>
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