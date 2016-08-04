var tests = require('./tests');
var firebase = require('./firebaseConfig');
var Game = require('../classes/Game');
var Player = require('../classes/Player');
var activeGames = [];

firebase.roomsRef.on('value',(snapshot)=>{
	firebase.rooms = snapshot.val();
});

// UTILITIES

function joinHandler(request,socket){
	// run some room tests (room existence / user.name / password)
	var status = tests.roomTests(request,socket);

	if(status.status) {
		// setup
		let player = new Player(request,socket);

		// hand client their user credentials.
		socket.emit('user update',{ id: socket.userId, name: socket.name });		

		// attach database listener 
		var database = firebase.db.ref(firebase.roomsPath + player.gameroom);

		// initialise game if necessary
		var found = false;

		activeGames.forEach((item,index)=>{
			if(item.game.id === player.gameroom) {
				found = true;

				if(firebase.rooms[request.id].status === 'pending') {
					item.game.newPlayer(player,socket);
				} else {
					socket.emit('request rejected','Sorry that room has a game underway');
				}				
			} 
		});

		if(!found) {
			var game = new Game(player, socket, database);
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