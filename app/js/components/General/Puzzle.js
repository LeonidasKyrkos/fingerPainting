import React, { Component } from 'react';
import Store from '../../stores/Store';
import { havePropsUpdated, hasPuzzleUpdated, hasClockUpdated } from '../../utilities/general';


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
		return havePropsUpdated(this.props,nextProps) || hasPuzzleUpdated(this.state,nextState) || hasClockUpdated(this.state,nextState);
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