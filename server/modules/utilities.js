const tests = require('./tests');
const firebase = require('./firebaseConfig');
const Game = require('../classes/Game');
const Player = require('../classes/Player');
let activeGames = [];

firebase.roomsRef.on('value',(snapshot)=>{
	var rooms = snapshot.val();
});

// UTILITIES

function joinHandler(request,socket){
	// run some room tests (room existence / user.name / password)
	let status = tests.roomTests(request,socket);
	let cookie = socket.request.cookies['fingerpainting_refresh_token'] || '';

	if(status.status) {
		// setup
		let player = new Player(request,socket,cookie);

		// hand client their user credentials.
		socket.emit('user update',player);		

		// initialise game if necessary
		var found = false;

		activeGames.forEach((item,index)=>{
			let gameInstance = item.game; 
			if(gameInstance.id === player.gameroom) {
				found = true;

				if(rooms[request.id].status === 'pending' || tests.inactivePlayer(cookie,gameInstance)) {
					gameInstance.newPlayer(player,socket);

				} else {
					socket.emit('request rejected','Sorry that room has a game underway');
				}		
			} 
		});

		if(!found) {
			var game = new Game(player, socket);
			var gameItem = { game: game };
			activeGames.push(gameItem);
		}
		
	} else {
		// inform the client that they're a fucking jerk and let them know why.
		socket.emit('request rejected',status.reason);
	}
}


function deleteActiveGame(id) {
	var index = activeGames.indexOf(id);

	if(index !== -1) {		
		activeGames.splice(index,1);
	}
}

// end of utils //

module.exports = {
	joinHandler: joinHandler,
	deleteActiveGame: deleteActiveGame
}