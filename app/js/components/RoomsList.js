import React, { Component } from 'react';
import Store from '../stores/Store';
import ErrorMessage from './ErrorMessage';

export default class RoomsList extends Component {
	constructor() {
		super();

		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	onChange(state) {
		this.setState(state);
	}

	renderRows() {
		let rows = this.state.rooms;
		let rowsArr = Object.keys(rows);

		return rowsArr.map((row,index)=>{
			return <tr key={row}>{this.renderColumn(rows[row])}</tr>
		});
	}

	renderColumn(row) {
		let itemsObj = row;
		let items = Object.keys(rowObj);

		return items.map((col,index)=>{
			return <td key={index}>{itemsObj[col]}</td>
		});
	}

	render() {
		return (
			<section>
				<ErrorMessage socket={this.state.socket} />
				<table className="table">
					<thead>
						<tr>
							<td>Room name</td>
							<td>🔒</td>
							<td>Dictionary</td>
							<td>Round length</td>
							<td>Status</td>
						</tr>
					</thead>
					<tbody>
						{this.renderRows()}
					</tbody>
				</table>
			</section>
		)
	}
}