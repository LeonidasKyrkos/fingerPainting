import React, { Component } from 'react';
import Store from '../stores/Store';

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

	renderPuzzle() {
		return this.state.puzzleArray.map((item, index)=>{
			return <span className="game__puzzle-word" key={index}>{item}</span>
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