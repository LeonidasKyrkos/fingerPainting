import alt from '../alt';
import firebase from 'firebase';

class CanvasActions {
	updatePaths(path) {
		return path;
	}

	emptyPaths() {
		return [];
	}

	bindToFirebase(ref) {
		ref.on('value',(snapshot)=>{
			let data = snapshot.val();

			if(data) {
				this.actions.updatePaths(data.path);
			} else {
				this.actions.emptyPaths();
			}
		});
	}
}

export default alt.createActions(CanvasActions);