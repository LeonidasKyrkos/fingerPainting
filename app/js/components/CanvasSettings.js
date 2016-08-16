import React, { Component, PropTypes } from 'react';
import Store from '../stores/Store';
import { isEqual as _isEqual } from 'lodash';
import { ChromePicker } from 'react-color';


export default class CanvasSettings extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
		this.setupVariables();
	}

	setupVariables() {
		this.sizes = {
			small: 3,
			medium: 5,
			large: 7,
			huge: 12
		}
	}

	componentDidMount() {
		Store.listen(this.onChange);
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	shouldComponentUpdate(nextProps,nextState) {
		return this.runUpdateTests(nextProps,nextState);
	}

	runUpdateTests(nextProps,nextState) {
		if(nextState.store.status !== this.state.store.status) {
			return true;
		}

		return false;
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

	openColourPicker(e) {
		document.querySelector('[data-js="colour-picker"]').className = 'canvas__colour-picker active';
	}

	closeColourPicker(e) {
		e.stopPropagation();
		this.colourTimer = setTimeout(()=>{
			document.querySelector('[data-js="colour-picker"]').className = 'canvas__colour-picker';
		},600)
	}

	clearTimer(e) {
		clearTimeout(this.colourTimer);
	}

	handleColorChange(colour) {
		document.querySelector('[data-js="colour-opener"]').setAttribute('style','background-color: ' + colour.hex);

		this.props.ctx.strokeStyle = colour.hex;
		this.props.ctx.shadowColor = colour.hex;		
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
			let classes = index === 0 ? 'canvas__brush-size-wrap active' : 'canvas__brush-size-wrap';
			let size = sizes[item];
			return (
				<li key={index} className="ib">
					<span className={classes} data-size={size} onClick={this.changeBrushSize.bind(this)}>
						<span className="canvas__brush-size" style={{width: size + 'px', height: size + 'px'}}></span>
					</span>
				</li>
			)
		});
	}

	changeBrushSize(e) {
		let sizes = document.querySelectorAll('[data-size]');
		sizes.forEach((el,index)=>{
			el.className = 'canvas__brush-size-wrap';
		});

		let newSize = e.target.getAttribute('data-size');
		e.target.className = 'canvas__brush-size-wrap active';
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
					<div onMouseOver={this.clearTimer.bind(this)} onMouseLeave={this.closeColourPicker.bind(this)} className="canvas__colour-picker" data-js="colour-picker">
						<ChromePicker onChangeComplete={ this.handleColorChange.bind(this) } />
					</div>
					<span style={ { backgroundColor: 'white' } } data-js="colour-opener" onClick={this.openColourPicker.bind(this)} className="canvas__colour-opener"></span>			
				</li>
			</ul>
		)
	}
}


CanvasSettings.propTypes = {
	fullClear: PropTypes.func.isRequired,
	scope: PropTypes.object.isRequired
}