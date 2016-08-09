import React, { Component, PropTypes } from 'react';
import Store from '../stores/Store';
import { isEqual as _isEqual } from 'lodash';

export default class CanvasPlayer extends Component {
	constructor() {
		super();

		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
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

	shouldComponentUpdate(nextProps,nextState) {
		return this.runUpdateTests(nextProps,nextState);
	}

	runUpdateTests(nextProps,nextState) {
		if(!_isEqual(nextState.store.paths,this.state.store.paths)) {
			return true;
		}

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