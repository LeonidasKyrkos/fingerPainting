import React, { Component } from 'react';
import Store from '../../../stores/Store';
import { roomStatusChangeTest, painterChangedTest } from '../../../utilities/general';
import _ from 'lodash';

export default class WaitingMsgClient extends Component {
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
		return roomStatusChangeTest(this.state,nextState) || painterChangedTest(this.state,nextState);
	}

	renderContent() {
		let status = this.state.store.status || '';
		let players = this.state.store.players || {};
		let painter = _.find(players,{ status: 'painter' });

		if(status !== 'pending') {
			return <span className="hide"></span>
		}

		let name = painter ? painter.name : 'the artist';

		return <span className="game__message">Waiting for {name} to start the game</span>
	}

	render() {
		let content = this.renderContent();

		return content;
	}
}