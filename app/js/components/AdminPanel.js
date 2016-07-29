import React, { Component } from 'react';
import Store from '../stores/Store';
import Actions from '../actions/Actions';
import DictionarySelect from './DictionarySelect';
import Dictionarys from './Dictionarys';

export default class AdminPanel extends Component {
	constructor() {
		super();

		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
		this.socket = io.connect('http://localhost:3000/admin');
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
	}

	render() {
		return (
			<div className="wrapper">
				<h1 className="alpha">Admin panel</h1>
				<DictionarySelect dictionarys={this.state.dictionarys} />
				<Dictionarys dictionarys={this.state.dictionarys} socket={this.socket} />
			</div>
		)
	}
}