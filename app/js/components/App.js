import React, { Component } from 'react';
import Actions from '../actions/Actions';
import Store from '../stores/Store';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.socket = io.connect('52.209.86.125:443');
		this.state = Store.getState();
	}

	componentDidMount() {
		this.socket.on('connected',(user)=>{
			Actions.updateSocket(this.socket);
		});

		this.socket.on('store update',(store)=>{
			Actions.updateStore(store)
		});

		this.socket.on('countdown',(data)=>{
			console.log(data);
		});

		this.socket.on('round end',()=>{
			console.log('ended');
		});

		this.socket.on('correct',()=>{
			console.log('correct!');
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

		Store.listen(this.onChange.bind(this));
	}

	onChange(state) {
		if(state.store.currentRoom !== this.state.store.currentRoom) {
			this.setState(state);
			this.joinRoom(state.store.currentRoom);
		}
	}

	joinRoom(room) {
		this.props.history.push(room);
	}

	renderChildren() {
		let childrenWithProps = React.Children.map(this.props.children, (child)=> {
			return React.cloneElement(child);
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