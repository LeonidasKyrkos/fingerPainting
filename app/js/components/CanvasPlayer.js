import React, { Component, PropTypes } from 'react';
import CanvasSettings from './CanvasSettings';
import Store from '../stores/Store';
import { redraw, renderPath, renderDot, clearContext } from '../utilities/canvasFunctions';
import _ from 'lodash';

export default class CanvasPlayer extends Component {
	constructor() {
		super();

		this.oldPaths = {};
		this.last = this.now();

		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		this.setupCanvas();		
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

	setupCanvas() {
		this.canvas = document.querySelector('#canvas');
		this.canvas.setAttribute('width',this.canvas.parentElement.offsetWidth);
		this.ctx = this.canvas.getContext('2d');
		this.ctx.strokeStyle = "#FFFFFF";
		this.ctx.lineWidth = 3;
		this.ctx.shadowBlur = 1;
		this.ctx.lineJoin = "round";
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

	refreshPathsObject() {
		this.newPaths = {
			x: [],
			y: [],
			drag: [],
			colours: [],
			widths: []
		};

		this.newPaths.x = this.getLastOfArray(this.paths.x);
		this.newPaths.y = this.getLastOfArray(this.paths.y);
		this.newPaths.drag = this.getLastOfArray(this.paths.drag);
		this.newPaths.colours = this.getLastOfArray(this.paths.colours);
		this.newPaths.widths = this.getLastOfArray(this.paths.widths);

		this.paths = this.newPaths;

	}

	getLastOfArray(arr) {
		if(arr.length > 10) {
			return arr.slice(arr.length - 10, arr.length);
		} else {
			return [];
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
		this.canvasX = this.canvas.offsetParent.offsetLeft;
		return e.pageX - this.canvasX;
	}

	// get y coordinate
	getY(e) {
		this.canvasY = this.canvas.offsetParent.offsetTop + 42;
		return e.pageY - this.canvasY;
	}

	// add to points array
	addToArray(mx,my,dragStatus) {
		this.paths.x.push(mx);
		this.paths.y.push(my);
		this.paths.drag.push(dragStatus);
		this.paths.colours.push(this.ctx.strokeStyle);
		this.paths.widths.push(this.ctx.lineWidth);

		redraw(this.paths,this.ctx);

		if(this.now() - this.last > 33) {
			this.last = this.now();
			this.pushPaths();

			if(this.paths && this.paths.x.length > 50) {
				this.refreshPathsObject();
			}
		}				
	}

	now() {
		return (new Date).getTime();
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

	startGame() {
		this.state.socket.emit('start round');
		this.refs.startGame.className = 'hide';
	}

	render() {
		let settings = !this.ctx ? '' : <CanvasSettings scope={this} fullClear={this.fullClear} ctx={this.ctx} />
		let startButton = this.state.store.status === 'pending' ? <button ref="startGame" className="canvas__start-btn" onClick={this.startGame.bind(this)}>Start game</button> : '';

		return (
			<div className="canvas__wrap" onDragStart={this.noDragging}>
				{settings}
				<canvas width="916" height="700" className="canvas" id="canvas" 
						onMouseDown={this.startDrawing.bind(this)} 
						onMouseUp={this.stopDrawing.bind(this)} 
						onMouseLeave={this.stopDrawing.bind(this)} 
						onMouseMove={this.dragBrush.bind(this)}
				>
				</canvas>
				{startButton}
			</div>
		)
	}
}