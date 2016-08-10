import React, { Component } from 'react';
import Store from '../stores/Store';
import { redraw } from '../utilities/canvasFunctions';

export default class CanvasClient extends Component {
	constructor() {
		super();

		this.state = Store.getState();

		this.state.socket.on('path update',(paths)=>{
			redraw(paths,this.ctx);
		});

		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		this.canvas = document.querySelector('#canvas');
		this.canvas.setAttribute('width',this.canvas.parentElement.offsetWidth);
		this.ctx = this.canvas.getContext('2d');
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
				<canvas width="916" height="750px" className="canvas" id="canvas"></canvas>
			</div>
		)
	}
}