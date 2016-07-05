import alt from '../alt';

class FooterActions {
	constructor() {
		this.generateActions(
			'getTopCharactersSuccess',
			'getTopCharactersFail'
		);
	}

	getTopCharacters() {
		
	}
}

export default alt.createActions(FooterActions);