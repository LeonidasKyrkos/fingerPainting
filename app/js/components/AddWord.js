import React, { Component, PropTypes } from 'react';

export default class AddWord extends Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.props.socket.on('error message',(error)=>{
			this.setState({
				success: '',
				error: error
			})
		});

		this.props.socket.on('success message',(message)=>{
			this.setState({
				error: '',
				success: message
			})
		});
	}

	submitWord(e) {
		e.preventDefault();

		let word = e.target.querySelector('[data-js="addword.input"]').value;

		let dictionary = e.target.getAttribute('data-table');
		let emission = {};
		emission[dictionary] = {};
		emission[dictionary][word] = word.toString();

		e.target.querySelector('[data-js="addword.input"]').value = '';
		this.props.socket.emit('new word',emission);			
	}

	render() {
		return (
			<form onSubmit={this.submitWord.bind(this)} data-js="addword" data-table={this.props.table} className="form--inline">
				<ul className="form__items">
					<li>
						<label className="form__control">
							<span className="form__label">Add a word</span>
							<span className="form__input-wrap">
								<input data-js="addword.input" type="text" className="form__input"/>
							</span>
						</label>
					</li>
					<li>
						<div className="form__control">
							<button type="submit" className="form__button--inline">Submit</button>
						</div>								
					</li>
					<li className="form__item-wrap--wide">
						<span className="form__error">{this.state.error}</span>
						<span className="form__success">{this.state.success}</span>
					</li>
				</ul>
			</form>
		)
	}
}