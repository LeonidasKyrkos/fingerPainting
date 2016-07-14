import React, { Component } from 'react';
import UsersActions from '../actions/UsersActions';
import UserActions from '../actions/UserActions';
import ClientConfigActions from '../actions/ClientConfigActions';
import firebase from 'firebase';
import config from '../firebaseConf.js';

const socket = io.connect('http://52.209.86.125:443/');

export default class App extends Component {
	constructor(props) {
		super(props);

		ClientConfigActions.updateConfig({ socket: socket });
	}

	componentDidMount() {
		socket.on('connected',(userId)=>{
			this.userId = userId;
		});

		socket.on('request accepted',(data)=>{
			firebase.initializeApp(config);
			let db = firebase.database();
			let room = data.room;

			ClientConfigActions.updateConfig({ db: firebase.database(), room: data.room, socket: socket });
			UserActions.updateUser(data.user);
			UsersActions.bindToRoom(db.ref(room + '/users'));

			this.joinRoom(room);
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
				requestJoin: this.requestJoin
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