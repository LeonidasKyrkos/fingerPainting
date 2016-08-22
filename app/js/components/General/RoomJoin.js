import React, { Component } from 'react';
import Store from '../../stores/Store';
import ErrorMessage from './ErrorMessage';

export default class RoomJoin extends Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
	}

	componentDidMount() {
		Store.listen(this.onChange);
	}

	componentDidUpdate() {
		this.refs.name.focus();
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	onChange(state) {
		this.setState(state);
	}

	authenticate(e) {
		e.preventDefault();

		let form = {};
		form.el = e.target;
		form.id = form.el.querySelector('[data-js="room.id"]').value;

		if(form.el.querySelector('[data-js="room.password"]')) {
			form.password = form.el.querySelector('[data-js="room.password"]').value;
		} else {
			form.password = '';
		}		

		form.name = form.el.querySelector('[data-js="room.name"]').value;

		this.requestJoin(form.name,form.id,form.password);
	}

	requestJoin(name,id,password) {
		this.state.socket.emit('join request',{ name: name, id: id, password: password });
	}

	renderPasswordField() {
		if(this.props.password) {
			return (
				<li>
					<label className="form__control">
						<span className="form__label">Password</span>
						<span className="form__input-wrap">
							<input data-js="room.password" type="password" className="form__input"/>
						</span>
					</label>
				</li>
			)
		}
	}

	changeHandler(e) {
		
	}

	handleKeyUp(e) {
		if(e.keyCode === 27) {
			this.closeForm();
		}
	}

	closeForm(e) {
		document.querySelector('[data-js="form-popup"]').className = 'hide';
	}

	render() {
		let id = this.props.id || '';
		let room = this.state.rooms[id] || {};

		return (
			<form onKeyDown={this.handleKeyUp.bind(this)} data-js="room.join" className="form--popup" onSubmit={this.authenticate.bind(this)}>
				<span className="form__close" onClick={this.closeForm.bind(this)}>x</span>
				<h3 className="gamma">{room.title}</h3>
				<ErrorMessage socket={this.state.socket} />
				<ul>
					<li>
						<label className="form__control">
							<span className="form__label">Name:</span>
							<span className="form__input-wrap">
								<input ref="name" maxLength="10" required data-js="room.name" autoComplete="off" type="text" className="form__input"/>
							</span>
						</label>
					</li>
					<li className="hide">
						<input required data-js="room.id" autoComplete="off" type="text" className="form__input" value={id} onChange={this.changeHandler.bind(this)} />
					</li>
					{this.renderPasswordField()}
					<li className="align-right">
						<button className="btn--primary">Submit</button>
					</li>
				</ul>
			</form>
		)
	}
}