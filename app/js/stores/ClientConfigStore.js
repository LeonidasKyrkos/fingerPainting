import alt from '../alt';
import ClientConfigActions from '../actions/ClientConfigActions';

class ClientConfigStore {
	constructor() {
		this.config = {};

		this.bindListeners({
			handleUpdateConfig: ClientConfigActions.UPDATE_CONFIG
		})
	}

	handleUpdateConfig(config) {
		this.config = config;
	}
}

export default alt.createStore(ClientConfigStore, 'ClientConfigStore');