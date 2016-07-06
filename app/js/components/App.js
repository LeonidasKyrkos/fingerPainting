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
		}

		socket.emit('user',username);
	}

	joinRoom(firebase) {
		this.props.history.push('/home');
	}

	requestJoin(name,id,password) {
		socket.emit('join request',{ name: name, id: id, password: password });
	}

	renderChildren() {
		let childrenWithProps = React.Children.map(this.props.children, (child)=> {
			return React.cloneElement(child, { requestJoin: this.requestJoin });
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