import React, { Component, PropTypes } from 'react';
import CanvasSettings from './CanvasSettings';
import Store from '../stores/Store';
import { redraw, renderPath, renderDot, clearContext } from '../utilities/canvasFunctions';
import _ from 'lodash';

export default class CanvasPlayer extends Component {
	constructor() {
		super();

		this.oldPaths = {};

		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		this.setupCanvas();		
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
		this.stopInterval();
	}

	onChange(state) {
		this.setState(state);
	}

	shouldComponentUpdate(nextProps,nextState) {
		return false;
	}

	setupCanvas() {
		this.canvas = document.querySelector('#canvas');
		this.canvas.setAttribute('width',this.canvas.parentElement.offsetWidth);
		this.ctx = this.canvas.getContext('2d');
		this.ctx.strokeStyle = "#FFFFFF";
		this.canvasX = this.canvas.offsetLeft;
		this.canvasY = this.canvas.offsetTop;
		this.forceUpdate();
	}

	initialisePathsObject() {
		this.paths = {
			x: [],
			y: [],
			drag: [],
			colours: [],
			widths: []
		}
	}

	// start
	startDrawing(e) {
		this.initialisePathsObject();
		this.painting = true;
		this.addToArray(this.getX(e),this.getY(e), false);
	}

	// drag
	dragBrush(e) {
		if(this.painting){
			this.addToArray(this.getX(e),this.getY(e), true);
		}
	}

	// finish
	stopDrawing() {
		delete this.paths;
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
		this.paths.x.push(mx);
		this.paths.y.push(my);
		this.paths.drag.push(dragStatus);
		this.paths.colours.push(this.ctx.strokeStyle);
		this.paths.widths.push(this.ctx.lineWidth);

		window.requestAnimationFrame(()=>{ this.pushPaths() });
		redraw(this.paths,this.ctx);
	}

	pushPaths() {
		this.state.socket.emit('path update',this.paths);
	}

	// empty points array
	clearArrays() {
		this.initialisePathsObject();
		this.pushPaths();
	}

	// empty contexts and points
	fullClear() {
		clearContext(this.ctx);
		this.clearArrays();
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