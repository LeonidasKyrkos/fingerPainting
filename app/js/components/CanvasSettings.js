import React, { Component, PropTypes } from 'react';
import Store from '../stores/Store';

export default class CanvasSettings extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = Store.getState();
	}

	componentDidMount() {
		Store.listen(this.onChange);
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
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

	render() {
		let scope = this.props.scope;
		let small = 3;
		let medium = 5;
		let large = 7;
		let huge = 12;

		let button = this.getButton();		
		
		return (
			<ul className="canvas__settings">
				<li>
					{button}
				</li>
				<li>
					<button className="canvas__settings-btn" onClick={this.props.fullClear.bind(scope)} >Reset</button>
				</li>
				<li className="canvas__brush-sizes">
					<ul>
						<li className="ib">
							<span className="canvas__brush-size-wrap" data-size={small} onClick={this.props.changeBrushSize.bind(scope)}>
								<span className="canvas__brush-size" style={{width: small + 'px', height: small + 'px'}}></span>
							</span>
						</li>
						<li className="ib">
							<span className="canvas__brush-size-wrap" data-size={medium} onClick={this.props.changeBrushSize.bind(scope)}>
								<span className="canvas__brush-size" style={{width: medium + 'px', height: medium + 'px'}}></span>
							</span>
						</li>
						<li className="ib">
							<span className="canvas__brush-size-wrap" data-size={large} onClick={this.props.changeBrushSize.bind(scope)}>
								<span className="canvas__brush-size" style={{width: large + 'px', height: large + 'px'}}></span>
							</span>
						</li>
						<li className="ib">
							<span className="canvas__brush-size-wrap" data-size={huge} onClick={this.props.changeBrushSize.bind(scope)}>
								<span className="canvas__brush-size" style={{width: huge + 'px', height: huge + 'px'}}></span>
							</span>
						</li>
					</ul>
				</li>
				<li className="canvas__colours">
					<ul>
						<li className="ib"><span data-color="#FFFFFF" style={{backgroundColor: '#FFFFFF'}} className="canvas__colour" onClick={this.props.updateColor.bind(scope)}></span></li>
						<li className="ib"><span data-color="#d15d0a" style={{backgroundColor: '#d15d0a'}} className="canvas__colour" onClick={this.props.updateColor.bind(scope)}></span></li>
						<li className="ib"><span data-color="#FFFB21" style={{backgroundColor: '#FFFB21'}} className="canvas__colour" onClick={this.props.updateColor.bind(scope)}></span></li>
						<li className="ib"><span data-color="#363CFF" style={{backgroundColor: '#363CFF'}} className="canvas__colour" onClick={this.props.updateColor.bind(scope)}></span></li>
						<li className="ib"><span data-color="#ff3399" style={{backgroundColor: '#ff3399'}} className="canvas__colour" onClick={this.props.updateColor.bind(scope)}></span></li>
						<li className="ib"><span data-color="#33cc33" style={{backgroundColor: '#33cc33'}} className="canvas__colour" onClick={this.props.updateColor.bind(scope)}></span></li>
						<li className="ib"><span data-color="#00ccff" style={{backgroundColor: '#00ccff'}} className="canvas__colour" onClick={this.props.updateColor.bind(scope)}></span></li>
						<li className="ib"><span data-color="#ff0000" style={{backgroundColor: '#ff0000'}} className="canvas__colour" onClick={this.props.updateColor.bind(scope)}></span></li>
					</ul>
				</li>
			</ul>
		)
	}
}


CanvasSettings.propTypes = {
	fullClear: PropTypes.func.isRequired,
	changeBrushSize: PropTypes.func.isRequired,
	updateColor: PropTypes.func.isRequired,
	scope: PropTypes.object.isRequired
}