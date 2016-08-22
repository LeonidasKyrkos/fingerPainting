import React, { Component } from 'react';
import Store from '../../stores/Store';
import ErrorMessage from './ErrorMessage';
import RoomJoin from './RoomJoin';

export default class RoomsList extends Component {
	constructor() {
		super();

		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
	}

	componentDidMount() {
		Store.listen(this.onChange);
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

	renderRows() {
		let rows = this.state.rooms || {};
		let rowsArr = Object.keys(rows) || [];

		return rowsArr.map((row,index)=>{
			let obj = rows[row];

			if(obj.players) {
				var players = <td>{Object.keys(obj.players).length}</td>
			} else {
				var players = <td>0</td>
			}

			return (
				<tr key={row} className="tar">
					<td className="tal">{obj.title}</td>
					<td className="tac">{obj.password}</td>
					<td>{obj.dictionary}</td>
					{players}
					<td>{obj.clock}</td>
					<td>{obj.status}</td>
					<td><button className="btn--primary" data-room={row} data-password={obj.password} onClick={this.openForm.bind(this)}>Join room</button></td>
				</tr>
			)
		});
	}

	openForm(e) {
		let form = document.querySelector('[data-js="form-popup"]');
		let roomId = e.target.getAttribute('data-room');
		let password = e.target.getAttribute('data-password');
		this.setState({
			roomId: roomId,
			password: password.length
		})
		form.className = '';
	}

	render() {
		return (
			<section>
				<table className="table--rooms">
					<thead>
						<tr className="tar">
							<td className="tal">Room name</td>
							<td className="tac">Password</td>
							<td>Dictionary</td>
							<td>Players</td>
							<td>Round time</td>
							<td>Status</td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{this.renderRows()}
					</tbody>
				</table>
				<div className="hide" data-js="form-popup">
					<RoomJoin id={this.state.roomId} password={this.state.password} />	
				</div>				
			</section>
		)
	}
}