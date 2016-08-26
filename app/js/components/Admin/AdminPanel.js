import React, { Component } from 'react';
import Store from '../../stores/Store';
import Actions from '../../actions/Actions';
import DictionarySelect from './DictionarySelect';
import Dictionarys from './Dictionarys';
import AdminRoomEdit from './AdminRoomEdit';

export default class AdminPanel extends Component {
	constructor() {
		super();

		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
		this.socket = io.connect('http://52.209.86.125/admin');
		this.attachListeners();
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

	attachListeners() {
		this.socket.on('dictionarys',(dictionarys)=>{
			Actions.updateDictionarys(dictionarys);
		});

		this.socket.on('rooms',(rooms)=>{
			Actions.updateRooms(rooms);
		});
	}

	render() {
		return (
			<div className="wrapper--noscores">
				<h1 className="beta">Admin panel</h1>
				<AdminRoomEdit rooms={this.state.rooms} dictionarys={this.state.dictionarys} socket={this.socket} />
				<DictionarySelect dictionarys={this.state.dictionarys} />
				<Dictionarys dictionarys={this.state.dictionarys} socket={this.socket} />
			</div>
		)
	}
}