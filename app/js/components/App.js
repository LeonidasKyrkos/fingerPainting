import React, { Component } from 'react';
import Actions from '../actions/Actions';
import Store from '../stores/Store';

const socket = io.connect('http://localhost:3000');

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = Store.getState();
	}

	componentDidMount() {
		socket.on('connected',(user)=>{
			Actions.updateSocket(socket);
		});

		socket.on('store update',(store)=>{
			Actions.updateStore(store)
		});

		socket.on('countdown',(data)=>{
			console.log(data);
		});

		socket.on('round end',()=>{
			console.log('ended');
		});

		socket.on('correct',()=>{
			console.log('correct!');
		});

		socket.on('puzzle',(puzzle)=>{
			Actions.updatePuzzle(puzzle)
		});

		socket.on('request rejected',(error)=>{
			Actions.updateError(error);
		});

		Store.listen(this.onChange.bind(this));
	}

	onChange(state) {
		if(state.store.currentRoom !== this.state.store.currentRoom) {
			this.setState(state);
			this.joinRoom(state.store.currentRoom);
		}
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