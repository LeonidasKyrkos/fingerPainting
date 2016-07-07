import alt from '../alt';
import DataActions from '../actions/DataActions';

class DataStore {
	constructor() {
		this.data = {};

		this.bindListeners({
			handleUpdateData: DataActions.UPDATE_DATA
		})
	}

	handleUpdateData(data) {
		this.data = data;
	}
}

export default alt.createStore(DataStore, 'DataStore');