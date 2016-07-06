import alt from '../alt';
import ErrorActions from '../actions/ErrorActions';

class ErrorStore {
	constructor() {
		this.errors = '';

		this.bindListeners({
			handleUpdateErrors: ErrorActions.UPDATE_ERRORS
		})
	}

	handleUpdateErrors(errors) {
		this.errors = errors;
	}
}

export default alt.createStore(ErrorStore, 'ErrorStore');