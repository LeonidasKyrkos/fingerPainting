import React, { Component } from 'react';
import Actions from '../../../actions/Actions';
import { painterTest } from '../../../utilities/general.js';
import Notification from './Notification';
import Footer from '../../Generic/Footer';


export default class App extends Component {
	constructor(props) {
		super(props);
		this.socket = io.connect('http://fingerpainting.io');
	}

	componentDidMount() {
		this.socket.on('connected',(user)=>{
			Actions.updateSocket(this.socket);
		});

		this.socket.on('store update',(store)=>{
			Actions.updateStore(store);
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
			Actions.updateNotification(notification);
		});

		this.socket.on('join room',(room)=>{
			this.joinRoom(room);
			this.socket.emit('joined room');
		});

		this.socket.on('rooms',(rooms)=>{
			Actions.updateRooms(rooms);
		});

		this.socket.on('redirect',(url)=>{
			window.location.pathname = url;
		});
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

		return (
			<div className="outerwrap">
				{this.renderChildren()}
				<Notification />
				<Footer />
			</div>
		);
	}
}

App.contextTypes = {
	router: React.PropTypes.object.isRequired
};