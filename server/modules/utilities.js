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
		gameroomHandler(request,socket);

		// store gameroom in socket data
		socket.gameroom = request.id;
		
		// inform the client that they can redirect to the room and hand them the database reference.
		socket.emit('request accepted',{
			database: firebase.db.ref(firebase.roomsPath + this.socket.gameroom),
			room: firebase.roomsPath + request.id,
			user: { id: socket.username, name: request.name }
		})

		// initialise game if necessary
		if(activeGames.indexOf(request.id) === -1) {
			var game = new Game(socket);
			activeGames.push(request.id);
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

function gameroomHandler(request,socket) {
	// update the users object of the requested room.
	updateReference(request.id + '/users/' + socket.username + '/name/', request.name);

	// update gameroom status [playing/not playing]
	var room = firebase.rooms[request.id];

	if(room.users && Object.keys(room.users).length === 1) {
		updateReference(request.id + '/users/' + socket.username + '/status/', 'captain');
	}
}

function updateReference(path,updVal) {
	var obj = {};
	obj[path] = updVal;

	firebase.roomsRef.update(obj);
}

function deleteUserFromRoom(socket) {
	if(socket.gameroom) {
		var users = firebase.rooms[socket.gameroom].users;

		if(users[socket.username]) {
			var userRef = firebase.db.ref(firebase.roomsPath + socket.gameroom + '/users/' + socket.username);
			userRef.remove();

			if(users.length === 1) {
				deleteActiveGame(socket.gameroom);
			}

			delete socket.gameroom;
		}
	}
}

// end of utils //


module.exports = {
	gameroomHandler: gameroomHandler,
	updateReference: updateReference,
	deleteUserFromRoom: deleteUserFromRoom,
	joinHandler: joinHandler,
	deleteActiveGame: deleteActiveGame
}