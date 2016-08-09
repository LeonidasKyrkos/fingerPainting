import React, { Component, PropTypes } from 'react';
import CanvasSettings from './CanvasSettings';
import { redraw, renderPath, renderDot, clearContext } from '../utilities/canvasFunctions';
import _ from 'lodash';

export default class CanvasPlayer extends Component {
	constructor() {
		super();
		this.paths = [];
	}

	componentDidMount() {
		this.startInterval();
		this.setupCanvas();		
	}

	componentWillUnmount() {
		this.stopInterval();
	}

	shouldComponentUpdate(nextProps,nextState) {
		return false;
	}

	startInterval() {
		this.interval = setInterval(()=>{
			if(this.paths.length) {
				this.pushPaths();
				this.paths = [];
			}
		},33);
	}

	setupCanvas() {
		this.canvas = document.querySelector('#canvas');
		this.canvas.setAttribute('width',this.canvas.parentElement.offsetWidth);
		this.ctx = this.canvas.getContext('2d');
		this.canvasX = this.canvas.offsetLeft;
		this.canvasY = this.canvas.offsetTop;
		this.forceUpdate();
	}

	// start
	startDrawing(e) {
		this.painting = true;
		this.current = this.paths.length;
		this.paths[this.current] = this.paths[this.current] || [];
		this.addToArray(this.getX(e),this.getY(e),false);
	}

	// drag
	dragBrush(e) {
		if(this.painting) {
			if(this.paths[this.current].length > 20) {
				let prevArr = _.clone(this.paths[this.current]);
				this.current++;
				this.paths[this.current] = [];

				for(let i = prevArr.length - 8; i < prevArr.length; i++) {
					this.paths[this.current].push(prevArr[i]);
				}
			}

			this.addToArray(this.getX(e),this.getY(e),true);
		}
	}

	// finish
	stopDrawing() {
		this.painting = false;
	}

	// UTILITIES

	// get x coordinate
	getX(e) {
		this.canvasX = this.canvas.offsetLeft;
		return e.pageX - this.canvasX;
	}

	// get y coordinate
	getY(e) {
		this.canvasY = this.canvas.offsetTop;
		return e.pageY - this.canvasY;
	}

	// add to points array
	addToArray(mx,my,dragStatus) {		
		this.paths[this.current].push({
			x: mx, 
			y: my, 
			color: this.ctx.strokeStyle, 
			size: this.ctx.lineWidth,
			dragging: dragStatus
		})

		redraw(this.paths,this.canvas,this.ctx);
	}

	pushPaths() {
		this.state.socket.emit('path update',{ this.paths });
	}

	// empty points array
	clearArrays() {
		this.paths = [];
	}

	// empty contexts and points
	fullClear() {
		clearContext(this.ctx);
		this.clearArrays();
		this.pushPaths();
	}

	render() {
		let settings = !this.ctx ? '' : <CanvasSettings scope={this} fullClear={this.fullClear} ctx={this.ctx} />

		return (
			<div className="canvas__wrap" onDragStart={this.noDragging}>
				{settings}
				<canvas width="916" height="750px" className="canvas" id="canvas" 
						onMouseDown={this.startDrawing.bind(this)} 
						onMouseUp={this.stopDrawing.bind(this)} 
						onMouseLeave={this.stopDrawing.bind(this)} 
						onMouseMove={this.dragBrush.bind(this)}>
				</canvas>				
			</div>
		)
	}
}