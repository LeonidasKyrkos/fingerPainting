import React, { Component, PropTypes } from 'react';
import Store from '../stores/Store';
import { isEqual as _isEqual } from 'lodash';

export default class CanvasSettings extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
		this.setupVariables();
	}

	setupVariables() {
		this.colors = {
			white: '#FFFFFF',
			brown: '#d15d0a',
			yellow: '#FFFB21',
			blue: '#363CFF',
			pink: '#ff3399',
			green: '#33cc33',
			lightBlue: '#00ccff',
			red: '#ff0000',
			canvasGrey: '#4E4E4E'
		}

		this.sizes = {
			small: 3,
			medium: 5,
			large: 7,
			huge: 12
		}
	}

	setupCtx() {
		this.props.ctx.strokeStyle = "#FFFFFF";
		this.props.ctx.shadowColor = "#FFFFFF";
		this.props.ctx.shadowBlur = 0;
		this.props.ctx.lineJoin = "round";
  		this.props.ctx.lineWidth = 5;
  		this.props.ctx.translate(0.5, 0.5);
	}

	componentDidMount() {
		Store.listen(this.onChange);
		this.setupCtx();
	}	

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	shouldComponentUpdate(nextProps,nextState) {
		return this.runUpdateTests(nextProps,nextState);
	}

	runUpdateTests(nextProps,nextState) {
		if (!_isEqual(nextProps,this.props) || nextState.store.status !== this.state.store.status) {
			return true;
		} else {
			return false;
		}
	}

	onChange(state) {
		this.setState(state);
	}

	startGame() {
		this.state.socket.emit('start round');
	}

	pause() {
		this.state.socket.emit('pause round');
	}

	unpause() {
		this.state.socket.emit('unpause round');
	}

	getButton() {
		if(this.state.store.status === 'pending') {
			return <button className="canvas__settings-btn" onClick={this.startGame.bind(this)}>Start game</button>
		}

		if(this.state.store.status === 'playing') {
			return <button className="canvas__settings-btn" onClick={this.pause.bind(this)}>Pause game</button>
		}

		if(this.state.store.status === 'paused') {
			return <button className="canvas__settings-btn" onClick={this.unpause.bind(this)}>Unpause</button>
		}

		return '';
	}

	handleColorChange(e) {
		let colorPickers = document.querySelectorAll('[data-js="colorPicker"]');

		colorPickers.forEach((color,index)=>{
			color.className = 'canvas__colour';
		});
		e.target.className = 'canvas__colour active';

		let newColor = e.target.getAttribute('data-color');

		this.props.ctx.strokeStyle = newColor;
		this.props.ctx.shadowColor = newColor;
	}

	renderColorPicker() {
		let colors = this.colors || {};
		return Object.keys(colors).map((item, index)=>{
			let color = colors[item];
			return <li key={index} className="ib"><span data-js="colorPicker" data-color={color} style={{backgroundColor:  color}} className="canvas__colour" onClick={this.handleColorChange.bind(this)}></span></li>
		});
	}

	renderSizePicker() {
		let sizes = this.sizes || {};
		return Object.keys(sizes).map((item, index)=>{
			let size = sizes[item];
			return (
				<li key={index} className="ib">
					<span className="canvas__brush-size-wrap" data-size={size} onClick={this.changeBrushSize.bind(this)}>
						<span className="canvas__brush-size" style={{width: size + 'px', height: size + 'px'}}></span>
					</span>
				</li>
			)
		});
	}

	changeBrushSize(e) {
		let newSize = e.target.getAttribute('data-size');
		this.props.ctx.lineWidth = newSize;
	}

	render() {
		return (
			<ul className="canvas__settings">
				<li>
					{this.getButton()}
				</li>
				<li>
					<button className="canvas__settings-btn" onClick={this.props.fullClear.bind(this.props.scope)} >Reset</button>
				</li>
				<li className="canvas__brush-sizes">
					<ul>
						{this.renderSizePicker()}
					</ul>
				</li>
				<li className="canvas__colours">
					<ul>
						{this.renderColorPicker()}
					</ul>
				</li>
			</ul>
		)
	}
}


CanvasSettings.propTypes = {
	fullClear: PropTypes.func.isRequired,
	scope: PropTypes.object.isRequired
}