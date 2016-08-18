import React, { Component } from 'react';

export default class RoomSpawn extends Component {
	render() {
		return(
			<div>
				<h2 className="beta">Spawn room</h2>
				<form data-js="room.spawn" className="form">
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
		)
	}	
}