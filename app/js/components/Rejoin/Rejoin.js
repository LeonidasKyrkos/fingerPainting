import React, { Component } from 'react';

export default class Rejoin extends Component {
	constructor() {
		super();

		//this.socket = io.connect('http://localhost:3000/rejoin');
	}

	render() {
		return <span>attempting to reconnect</span>
	}
}