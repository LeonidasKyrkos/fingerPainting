import React, { Component, PropTypes } from 'react';

import CanvasSettings from './CanvasSettings';
import Store from '../stores/Store';

export default class Canvas extends Component {
	constructor(props) {
		super(props);

		this.state = Store.getState();
		this.setPlayerStatus();
		this.points = [];

		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		Store.listen(this.onChange);
		this.setupCanvas();
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	setPlayerStatus() {
		if(this.state.store.users) {
			let user = this.state.store.users[this.state.socket.id] || {};
			if(user.status === 'captain') {
				this.state.player = true;
			} else {
				this.state.player = false;
			}
		}
	}

	setupCanvas() {
		this.canvas = document.querySelector('#canvas');
		this.canvas.setAttribute('width',this.canvas.parentElement.offsetWidth);
		this.ctx = this.canvas.getContext('2d');
		this.ctx.strokeStyle = "#FFFFFF";
		this.ctx.shadowColor = "#FFFFFF";
		this.ctx.shadowBlur = 0;
		this.ctx.lineJoin = "round";
  		this.ctx.lineWidth = 5;
  		this.ctx.translate(0.5, 0.5);
	}

	// start
	startDrawing(e) {
		this.painting = true;
		this.current = this.points.length || 0;
		this.clearArrays();
		this.addToArray(this.getX(e),this.getY(e),false);
	}

	// drag
	dragBrush(e) {
		if(this.painting) {
			if(this.points.length > 30) {
				let prevArr = this.points;
				this.current++;
				this.clearArrays();
				
				let obj = prevArr[prevArr.length - 1];
				let counter = 0;

				for(let i = prevArr.length - 8; i < prevArr.length -1; i++) {
					this.points[counter] = prevArr[i];
					counter++;
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
		this.points.push({
			x: mx, 
			y: my, 
			color: this.ctx.strokeStyle, 
			size: this.ctx.lineWidth,
			dragging: dragStatus
		})

		this.pushPaths();
		this.redraw();
	}

	pushPaths() {
		this.state.socket.emit('path update',{ path: this.points });
	}

	//client redraw function
	redraw() {
		let path = [];

		if(this.state.player) {
			path = this.points;
		} else if (this.state.store.paths) {
			path = this.state.store.paths.path;
		}

		if(!path.length) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			return;
		}

		if(path.length > 4) {
			this.ctx.beginPath();		
			let item = path[0];
			var startX = item.x;
			var startY = item.y;
			
			this.ctx.moveTo(startX,startY);

			if(item.dragging || path[1].dragging) {
				this.renderPath(path);
			}
		} else {
			this.renderDot(path);
		}		
	}

	// path renderer
	renderPath(path) {
		let first = path[0];
		let length = path.length;

		for(var i = 0; i < path.length; i++) {
			let val = path[i];

			if(i > 0 && i < length - 2) {
				if(val.joined) {
					var x = (val.x + path[i + 1].x) / 2;
					var y = (val.y + path[i + 1].y) / 2;


				} else {
					var x = (val.x + path[i + 1].x) / 2;
					var y = (val.y + path[i + 1].y) / 2;
				}
				
				this.ctx.quadraticCurveTo(val.x, val.y, x, y);					
			}

			this.ctx.lineWidth = first.size;
			this.ctx.strokeStyle = first.color;
			this.ctx.stroke();
		}
	}

	// line renderer

	renderDot(path) {
		let obj = path[0];

		this.ctx.beginPath();
		this.ctx.arc(obj.x, obj.y, obj.size / 2, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = obj.color;
		this.ctx.fill();
		this.ctx.closePath();
	}

	// clear the supplied context
	clearContext(ctx) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	// empty points array
	clearArrays() {
		this.points = [];
	}

	// empty contexts and points
	fullClear() {
		this.clearContext(this.ctx);
		this.clearArrays();
		this.pushPaths();
	}


	// change the current stroke colour
	updateColor(e) {
		let newColor = e.target.getAttribute('data-color');

		this.ctx.strokeStyle = newColor;
		this.ctx.shadowColor = newColor;
	}


	// change brush size
	changeBrushSize(e) {
		let newSize = e.target.getAttribute('data-size');
		this.ctx.lineWidth = newSize;
	}
	

	render() {
		this.setPlayerStatus();
		if(this.canvas) {
			this.canvasX = this.canvas.offsetLeft;
			this.canvasY = this.canvas.offsetTop;

			if(!this.state.player) {
				this.redraw();
			}
		}

		if(this.state.player) {
			var canvasSettings = (
				<CanvasSettings 
					scope={this} 
					fullClear={this.fullClear} 
					changeBrushSize={this.changeBrushSize} 
					updateColor={this.updateColor} 
				/>
			);

			var canvas = ( 
				<canvas width="100" height="600px" className="canvas" id="canvas" 
						onMouseDown={this.startDrawing.bind(this)} 
						onMouseUp={this.stopDrawing.bind(this)} 
						onMouseLeave={this.stopDrawing.bind(this)} 
						onMouseMove={this.dragBrush.bind(this)} 
				>
				</canvas>
			)
		} else {
			var canvasSettings = '';
			var canvas = (
				<canvas width="100" height="600px" className="canvas" id="canvas"></canvas>
			)
		}

		return (
			<div className="canvas__wrap">
				{canvasSettings}
				{canvas}
			</div>
		)
	}
}