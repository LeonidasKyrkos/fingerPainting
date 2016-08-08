import React, { Component } from 'react';
import Store from '../stores/Store';
import { isEqual as _isEqual } from 'lodash';

export default class Puzzle extends Component {
	constructor() {
		super();

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

	shouldComponentUpdate(nextProps,nextState) {
		return this.runUpdateTests(nextProps,nextState);
	}

	runUpdateTests(nextProps,nextState) {
		if (!_isEqual(nextProps,this.props)) {
			return true;
		}

		if(!_isEqual(nextState.puzzleArray,this.state.puzzleArray)) {
			return true;
		}

		if(nextState.store.clock !== this.state.store.clock) {
			return true;
		}

		return false;
	}

	renderPuzzle() {
		return this.state.puzzleArray.map((item, index)=>{
			return <span className="game__puzzle-word" key={index}>{this.renderLetters(item)}</span>
		});
	}

	renderLetters(word) {
		return word.map((letter,index)=>{
			return <span key={index}>{letter}</span>
		});
	}

	render() {
		return (
			<div className="game__top">
				<span className="game__puzzle">{this.renderPuzzle()}</span>
				<span className="game__timer">{this.state.store.clock}</span>
			</div>			
		);
	}
}