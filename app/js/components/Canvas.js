import React, { Component, PropTypes } from 'react';
import firebase from 'firebase';

import CanvasSettings from './CanvasSettings';
import UsersStore from '../stores/UsersStore';
import UserStore from '../stores/UserStore';
import ClientConfigStore from '../stores/ClientConfigStore';
import CanvasActions from '../actions/CanvasActions';
import CanvasStore from '../stores/CanvasStore';


export default class Canvas extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.config = ClientConfigStore.getState().config;
		this.state.user = UserStore.getState().user;
		this.state.users = {};
		this.state.canvasPaths = [];

		// firebase stuff
		this.db = this.state.config.db;
		this.room = this.state.config.room;
		this.pathsRef = this.db.ref(this.room + '/paths/')
		CanvasActions.bindToFirebase(this.pathsRef);

		this.socket = this.state.config.socket;

		this.userId = this.state.user.id;
		this.points = [];
		this.pathChange = this.pathChange.bind(this);

		this.areWeTheCaptainNow();
	}

	areWeTheCaptainNow() {
		Object.keys(this.state.users).forEach((item,index)=>{
			if(item.toString() === this.userId.toString() && this.state.users[item].status === 'captain') {
				this.setState({
					player: true
				});
			}
		});

		if(this.state.player) {
			CanvasStore.unlisten(this.pathChange);
		} else {
			CanvasStore.listen(this.pathChange);
		}
		
	}

	componentDidMount() {
		UsersStore.listen(this.onChange.bind(this));

		this.setupCanvas();
	}

	componentWillUnmount() {
		UsersStore.unlisten(this.onChange.bind(this));
		CanvasStore.unlisten(this.pathChange);
	}

	onChange(state) {
		this.setState(state);
		this.areWeTheCaptainNow();
	}

	pathChange(state) {
		this.setState(state);
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
		this.setupCurrent();
		this.addToArray(this.getX(e),this.getY(e),false);
	}

	// drag
	dragBrush(e) {
		if(this.painting) {
			if(this.points[this.current].length > 30) {
				let prevArr = this.points[this.current];
				this.current++;
				this.setupCurrent();
				
				let obj = prevArr[prevArr.length - 1];
				let counter = 0;

				for(let i = prevArr.length - 8; i < prevArr.length -1; i++) {
					this.points[this.current][counter] = prevArr[i];
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

	// setup latest (current) path item

	setupCurrent() {		
		this.points[this.current] = [];	
	}	

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
		this.points[this.current].push({
			x: mx, 
			y: my, 
			color: this.ctx.strokeStyle, 
			size: this.ctx.lineWidth,
			dragging: dragStatus
		})

		this.pushPathsToFirebase();
		this.redraw();
	}

	pushPathsToFirebase() {
		this.pathsRef.set({ path: this.points[this.current] });
	}

	//client redraw function
	redraw() {
		let points = this.state.player ? this.points : this.state.canvasPaths;

		if(!points.length) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			return;
		}

		let path = points[points.length - 1];

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
		this.pathsRef.remove();
	}

	// empty contexts and points
	fullClear() {
		this.clearContext(this.ctx);
		this.clearArrays();
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
		if(this.canvas) {
			this.canvasX = this.canvas.offsetLeft;
			this.canvasY = this.canvas.offsetTop;

			if(!this.state.player) {
				this.redraw();
			}
		}

		if(this.state.player) {
			var canvasSettings = <CanvasSettings scope={this} socket={this.socket} fullClear={this.fullClear} changeBrushSize={this.changeBrushSize} updateColor={this.updateColor} />;
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