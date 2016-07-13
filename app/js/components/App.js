import React, { Component } from 'react';
import UsersActions from '../actions/UsersActions';
import UserActions from '../actions/UserActions';
import firebase from 'firebase';
import config from '../firebaseConf.js';

const socket = io.connect('http://localhost:3000');

export default class App extends Component {
	componentDidMount() {
		socket.on('connected',(userId)=>{
			this.userId = userId;
		});

		socket.on('request accepted',(data)=>{
			firebase.initializeApp(config);
			this.db = firebase.database();


			UsersActions.bindToRoom(this.db.ref(data.room + '/users'));
			this.joinRoom(data.room);
		});
	}

	requestJoin(name,id,password) {
		socket.emit('join request',{ name: name, id: id, password: password });
	}

	joinRoom(room) {
		this.props.history.push(room);
	}

	renderChildren() {
		let childrenWithProps = React.Children.map(this.props.children, (child)=> {
			return React.cloneElement(child, { 
				requestJoin: this.requestJoin,
				socket: socket,
				userId: this.userId
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