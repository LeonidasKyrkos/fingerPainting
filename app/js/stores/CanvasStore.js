import alt from '../alt';
import CanvasActions from '../actions/CanvasActions';

class CanvasStore {
	constructor() {
		this.canvasPaths = [];

		this.bindListeners({
			handleUpdatePaths: CanvasActions.UPDATE_PATHS,
			handleEmptyPaths: CanvasActions.EMPTY_PATHS
		})
	}

	handleUpdatePaths(path) {
		this.canvasPaths.push(path);
	}

	handleEmptyPaths(arr) {
		this.canvasPaths = arr;
	}
}

export default alt.createStore(CanvasStore, 'CanvasStore');