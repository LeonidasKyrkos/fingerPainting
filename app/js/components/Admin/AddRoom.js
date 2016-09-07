import React, { Component } from 'react';
import RenderOptions from './RenderOptions';

export default class AddRoom extends Component {
	constructor(props) {
		super(props);
	}

	addRoom(e) {
		let data = {
			title: this.refs.title.value,
			password: this.refs.password.value,
			dictionary: document.querySelector('#dictionary').value,
			clock: 90,
			status: 'pending'
		}

		this.props.socket.emit('spawn room',data);
		this.clearRefs();
	}

	clearRefs() {
		for(let ref in this.refs) {
			this.refs[ref].value = '';
		}
	}

	render() {
		return(
			<tr>
				<td><input className="form__input" type="text" ref="title" /></td>
				<td><input className="form__input" ref="password" type="text" /></td>
				<td>
					<RenderOptions defaultVal="default" name="dictionary" obj={this.props.dictionarys} />
				</td>
				<td><input className="form__input" ref="discord" type="text" /></td>
				<td><button onClick={this.addRoom.bind(this)} className="btn--primary">Add room</button></td>
			</tr>
		)
	}
}