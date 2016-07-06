import React, { Component } from 'react';
import ErrorStore from '../stores/ErrorStore';

const socket = io.connect('http://localhost:3000');

export default class App extends Component {
	componentDidMount() {
		socket.on('connected', this.init.bind(this));
		//socket.on('dictionary');
		socket.on('request accepted', this.joinRoom.bind(this));
	}

	init() {
		let username = localStorage.getItem('picuser');

		if(!username) {
			username = (new Date()).getTime();
			localStorage.setItem('picuser',username);
		}

		socket.emit('user',username);
	}

	joinRoom(data) {
		this.props.history.push('/rooms/' + data.room);
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