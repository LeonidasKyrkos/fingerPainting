var tests = require('./tests');
var firebase = require('./firebaseConfig');
var Game = require('../classes/Game');
var activeGames = [];

firebase.roomsRef.on('value',function(snapshot){
	firebase.rooms = snapshot.val();
});

// UTILITIES

function joinHandler(request,socket){
	// run some room tests (room existence / user.name / password)
	var status = tests.roomTests(request,socket);

	if(status.status) {
		// setup
		socket.name = request.name
		socket.gameroom = request.id;

		// hand client their user credentials.
		socket.emit('user update',{ id: socket.userId, name: socket.name });		

		// attach database listener 
		var database = firebase.db.ref(firebase.roomsPath + request.id);

		// initialise game if necessary
		var found = false;

		for(var i = 0; i < activeGames.length; i++) {
			var item = activeGames[i];

			if(item.game.id === request.id) {
				item.game.attachListeners(socket);
				found = true;
			} 
		}

		if(!found) {
			var game = new Game(socket,request.id,database);
			var gameItem = { game: game };
			activeGames.push(gameItem);
		}
		
	} else {
		// inform the client that they're a fucking jerk and let them know why.
		socket.emit('request rejected',{ errors: status.reason });
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