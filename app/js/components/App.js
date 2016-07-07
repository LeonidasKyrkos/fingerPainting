import React, { Component } from 'react';
import ErrorStore from '../stores/ErrorStore';
import DataStore from '../stores/DataStore';
import createDatabaseHookups from '../modules/createDatabaseHookups';

const socket = io.connect('http://localhost:3000');

export default class App extends Component {
	componentDidMount() {
		socket.on('connected', this.init.bind(this));
		socket.on('request accepted',(data)=>{
			createDatabaseHookups(data.room);
			this.joinRoom(data.room);
		});
	}

	init() {
		let userID = localStorage.getItem('picuser');

		if(!userID) {
			userID = (new Date()).getTime();
			localStorage.setItem('picuser',userID);
		}

		socket.emit('user',userID);
	}

	joinRoom(room) {
		this.props.history.push('/rooms/' + room);
	}

	requestJoin(name,id,password) {
		socket.emit('join request',{ name: name, id: id, password: password });
	}

	renderChildren() {
		let childrenWithProps = React.Children.map(this.props.children, (child)=> {
			return React.cloneElement(child, { 
				requestJoin: this.requestJoin,
				socket: socket
			});
		});

		return childrenWithProps;
	}

	render() {
		const children = this.renderChildren();

		return (
			<div>
				{children}
			</div>
		);
	}
}