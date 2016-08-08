import React, { Component } from 'react';
import Actions from '../actions/Actions';
import Store from '../stores/Store';
import { painterTest } from '../utilities/general.js';
import Notifications from './Notifications';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.socket = io.connect('http://localhost:3000');
		this.state = Store.getState();
	}

	componentDidMount() {
		this.socket.on('connected',(user)=>{
			Actions.updateSocket(this.socket);
		});

		this.socket.on('store update',(store)=>{
			Actions.updateStore(store)
			painterTest(store.players,this.state.socket.id) ? 
					Actions.updatePlayerStatus(true) : 
					Actions.updatePlayerStatus(false);
		});

		this.socket.on('puzzle',(puzzleArray)=>{
			Actions.updatePuzzle(puzzleArray)
		});

		this.socket.on('request rejected',(error)=>{
			Actions.updateError(error);
		});

		this.socket.on('debug',(debug)=>{
			console.log(debug);
		});

		this.socket.on('player',(player)=>{
			Actions.updatePlayer(player);
		});

		this.socket.on('notification',(notification)=>{
			console.log(notification);
			Actions.updateNotification(notification);
		});

		Store.listen(this.onChange.bind(this));
	}

	onChange(state) {
		if(state.store.currentRoom !== this.state.store.currentRoom) {
			this.setState(state);
			this.joinRoom(state.store.currentRoom);
		}
	}

	joinRoom(room) {
		this.context.router.push(room);
	}

	renderChildren() {
		let childrenWithProps = React.Children.map(this.props.children, (child)=> {
			return React.cloneElement(child);
		});

		return childrenWithProps;
	}

	render() {
		const children = this.renderChildren();
		let notification = this.state.notification.text.length ? <Notifications /> : null;

		return (
			<div>
				{children}
				{notification}
			</div>
		);
	}
}

App.contextTypes = {
	router: React.PropTypes.object.isRequired
};