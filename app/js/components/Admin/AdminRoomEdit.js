import React, { Component } from 'react';
import Store from '../../stores/Store';
import Actions from '../../actions/Actions';
import AddRoom from './AddRoom';

export default class AdminRoomEdit extends Component {
	constructor(props) {
		super(props);
	}

	renderRows() {
		this.rooms = this.props.rooms || {};
		let roomsArr = Object.keys(this.rooms) || [];

		return roomsArr.map((id,index)=>{
			let room = this.rooms[id];
			return (
				<tr key={id} id={id}>
					<td className="tal"><input onChange={this.updateObject.bind(this)} className="form__input" type="text" name="title" defaultValue={room.title}/></td>
					<td><input onChange={this.updateObject.bind(this)} className="form__input" name="password" type="text" defaultValue={room.password}/></td>
					<td>
						<label className="form__control">
							<span className="form__select-wrap">
								<select onChange={this.updateObject.bind(this)} defaultValue={room.dictionary} className="form__select" name="dictionary">
									{this.renderOptions(this.props.dictionarys)}
								</select>
							</span>							
						</label>
					</td>
					<td>
						<input onChange={this.updateObject.bind(this)} className="form__input" name="discord" type="text" defaultValue={room.discord || ''}/>
					</td>
					<td className="tac">
						<button onClick={this.deleteRoom.bind(this)} className="btn--primary">Destroy</button>
					</td>
				</tr>
			)
		});
	}

	renderOptions(obj,activeItem) {
		let props = Object.keys(obj);

		return props.map((prop,index)=>{
			return <option key={index} value={prop}>{prop}</option>
		});
	}

	updateObject(e) {
		let node = e.target;

		let data = {
			id: this.findId(node),
			type: node.getAttribute('name'),
			value: node.value
		}

		this.props.socket.emit('room update',data)
	}

	deleteRoom(e) {
		let node = e.target;
		let id = this.findId(node);
		this.props.socket.emit('delete room',id);
	}

	findId(node) {
		if(node.parentNode.nodeName === 'TR'){
			return node.parentNode.getAttribute('id');
		} else {
			return this.findId(node.parentNode);
		}
	}

	render() {
		return (
			<div className="admin__rooms">
				<h3 className="delta">Room edit</h3>
				<table className="table--rooms">
					<thead>
						<tr>
							<td className="tal">Name</td>
							<td>Password</td>
							<td>Dictionary</td>
							<td>Discord code</td>
							<td className="tac">Actions</td>
						</tr>
					</thead>
					<tbody>
						{this.renderRows()}
						<AddRoom socket={this.props.socket} dictionarys={this.props.dictionarys} />
					</tbody>					
				</table>
			</div>
		)
	}
}