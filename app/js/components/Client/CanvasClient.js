import React, { Component } from 'react';
import Store from '../../stores/Store';
import { redraw } from '../../utilities/canvasFunctions';
import WaitingMsgClient from './WaitingMsgClient';

export default class CanvasClient extends Component {
	constructor() {
		super();

		this.state = Store.getState();

		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		this.canvas = document.querySelector('#canvas');
		this.canvas.setAttribute('width',this.canvas.parentElement.offsetWidth);
		this.ctx = this.canvas.getContext('2d');				

		if(typeof this.state.socket.on === 'function') {
			this.state.socket.on('reset',()=>{
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			});
			
			this.state.socket.on('path update',(paths)=>{
				redraw(paths,this.ctx);
			});
		}

		Store.listen(this.onChange);
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	shouldComponentUpdate(nextProps,nextState) {
		return false;
	}

	noDragging(e) {
		e.preventDefault();
	}	

	render() {
		return (
			<div className="canvas__wrap" onDragStart={this.noDragging}>
				<WaitingMsgClient />
				<canvas width="916" height="700px" className="canvas--client" id="canvas"></canvas>
			</div>
		)
	}
}