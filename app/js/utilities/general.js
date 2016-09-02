import * as _ from 'lodash';

// is the provided ID the painter? Oh golly let's find out
export function painterTest(players,id) {
	for(let player in players) {
		if(player === id && players[player].status === 'painter') {
			return true;
		}
	}

	return false;
}

// update tests

// NUMBER OF PLAYERS
export function playerCountChangedTest(currentState,nextState) {
	let playerCount = Object.keys(currentState.store.players).length;
	let newPlayerCount = Object.keys(nextState.store.players).length;

	return playerCount !== newPlayerCount;
}


// ROOM STATUS
export function roomStatusChangeTest(currentState,nextState) {
	let currentStatus = currentState.store.status || '';
	let nextStatus = nextState.store.status;

	return currentStatus !== nextStatus;
}


// PAINTER
export function painterChangedTest(currentState,nextState) {
	let currentPainter = _.find(currentState.store.players,{ status: "painter" });
	let currentPainterId = currentPainter ? currentPainter.id : 0;
	let nextPainter = _.find(nextState.store.players,{ status: "painter" });
	let nextPainterId = nextPainter ? nextPainter.id : 0;

	return currentPainterId !== nextPainterId;
}


// CHAT LOG
export function hasChatUpdated(currentState, nextState) {
	return !_.isEqual(nextState.store.chatLog,currentState.store.chatLog);
}


// PROPS
export function havePropsUpdated(currentProps, nextProps) {
	return !_.isEqual(currentProps, nextProps);
}

// PLAYER STATUS
export function hasPlayerStatusUpdated(currentState, nextState) {
	return currentState.player.status !== nextState.player.status;
}

// PUZZLE
export function hasPuzzleUpdated(currentState, nextState) {
	return !_.isEqual(nextState.puzzleArray,currentState.puzzleArray);
}

// CLOCK
export function hasClockUpdated(currentState, nextState) {
	return nextState.store.clock !== this.state.store.clock;
}