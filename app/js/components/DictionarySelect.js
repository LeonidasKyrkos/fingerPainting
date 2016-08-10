import React, { Component, PropTypes } from 'react';
import Store from '../stores/Store';
import Dictionarys from './Dictionarys';

export default class DictionarySelect extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		let select = document.querySelector('#dictionarysList');

		select.addEventListener('change',(e)=>{
			let value = e.target.value;
			let table = document.querySelector('#table-' + value);

			if(table){
				Dictionarys.prototype.hideTables();
				Dictionarys.prototype.showTable(table);
			}
		});
	}

	renderOptions() {
		let dictionarys = this.props.dictionarys || {};
		let items = Object.keys(dictionarys);

		return items.map((item,index)=>{		
			return <option key={index} value={item}>{item}</option>
		});
	}

	render() {
		return(
			<form className="form">
				<label className="form__control">
					<span className="form__label">Dictionarys</span>
					<span className="form__select-wrap">
						<select id="dictionarysList" className="form__select">
							<option value="null">Select a dictionary</option>
							{this.renderOptions()}
						</select>
					</span>					
				</label>
			</form>
		)
	}
}