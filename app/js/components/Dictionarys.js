import React, { Component, Proptypes } from 'react';

import AddWord from './AddWord';

export default class Dictionarys extends Component {
	constructor(props) {
		super(props);
	}

	renderTables() {
		let dictionarys = this.props.dictionarys || {};

		return Object.keys(dictionarys).map((title,index)=>{
			let id = "table-" + title;
			return (
				<div id={id} data-js="dictionary.table" className="hide" key={index}>
					<AddWord socket={this.props.socket} table={title} />
					<table className="table">
						<thead>
							<tr>
								<td>Word</td>
							</tr>						
						</thead>
						<tbody>
							{this.renderRows(dictionarys[title],title)}
						</tbody>
					</table>
				</div>
			)
		});
	}

	deleteWord(item, title) {
		this.props.socket.emit('delete word',{ dictionary: title, word: item });
	}

	renderRows(dictionary, title) {
		return Object.keys(dictionary).map((item,index)=>{
			return (
				<tr key={index}>
					<td>{item}<button data-js="dictionary.remove" onClick={()=>{ this.deleteWord(item,title) }} className="btn--tertiary form__delete">x</button></td>
				</tr>
			)
		});
	}

	showTable(table) {
		table.className = '';
	}

	hideTables() {
		let tables = document.querySelectorAll('[data-js="dictionary.table"]');
		
		tables.forEach((item,index)=>{
			item.className = 'hide';
		});
	}

	render() {
		return(
			<div>
				{this.renderTables()}	
			</div>			
		)
	}
}