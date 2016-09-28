import React, { Component } from 'react';
import Store from '../../../stores/Store';

export default class Stats extends Component {
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

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	onChange(state) {
		this.setState(state);
	}

    renderStats() {
        return <span>Hello there</span>
    }
	
	render() {
		return (
			<section>
                <h2 className="beta">Stats</h2>
                <table className="table">
                    <tbody>
                        {this.renderStats()}
                    </tbody>
                </table>
            </section>
		);
	}
}