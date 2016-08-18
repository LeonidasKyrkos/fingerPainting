import React, { Component } from 'react';
import Store from '../stores/Store';
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

			return (
				<tr key={row} className="tar">
					<td className="tal">{row}</td>
					<td className="tac">{rows[row].password}</td>
					<td>{rows[row].dictionary}</td>
					<td>{rows[row].clock}</td>
					<td>{rows[row].status}</td>
					<td><button className="btn--primary" data-room={row} data-password={rows[row].password} onClick={this.openForm.bind(this)}>Join room</button></td>
				</tr>
			)
		});
	}

	openForm(e) {
		let form = document.querySelector('[data-js="form-popup"]');
		let roomName = e.target.getAttribute('data-room');
		let password = e.target.getAttribute('data-password');
		this.setState({
			roomName: roomName,
			password: password.length
		})
		form.className = '';
	}

	render() {
		return (
			<section>
				<table className="table--rooms">
					<thead>
						<tr>
							<td>Room name</td>
							<td className="tac">🔒</td>
							<td className="tar">Dictionary</td>
							<td className="tar">Round length</td>
							<td className="tar">Status</td>
							<td className="tar"></td>
						</tr>
					</thead>
					<tbody>
						{this.renderRows()}
					</tbody>
				</table>
				<div className="hide" data-js="form-popup">
					<RoomJoin roomName={this.state.roomName} password={this.state.password} />	
				</div>				
			</section>
		)
	}
}