import React, { Component } from 'react';

export default class RoomPicker extends Component {
	authenticate(e) {
		e.preventDefault();
	}

	render() {
		return (
			<div className="wrapper">
				<h1 className="alpha">Join a room</h1>
				<form id="login" className="form" onSubmit={this.authenticate}>
					<ul>
						<li>
							<label className="form__control">
								<span className="form__label">Username:</span>
								<span className="form__input-wrap">
									<input autoComplete="off" type="text" className="form__input"/>
								</span>
							</label>
						</li>
						<li>
							<label className="form__control">
								<span className="form__label">Password</span>
								<span className="form__input-wrap">
									<input type="password" className="form__input"/>
								</span>
							</label>
						</li>
						<li className="align-right">
							<button className="btn--primary">Submit</button>
						</li>
					</ul>
				</form>
			</div>
		);
	}
}