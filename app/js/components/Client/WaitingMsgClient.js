import React, { Component } from 'react';

export default class WaitingMsgClient extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span className="game__message">Waiting for Artist to start the game</span>
		)
	}
}