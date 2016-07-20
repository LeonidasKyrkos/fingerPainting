var firebase = require('./firebaseConfig');

function handler(request,socket) {
	// update the users object of the requested room.
	updateReference(request + '/users/' + socket.username + '/name/', socket.name);

	// update gameroom status [playing/not playing]
	var room = firebase.rooms[request];

	if(room.users && Object.keys(room.users).length === 1) {
		updateReference(request + '/users/' + socket.username + '/status/', 'captain');
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

		if(users && users[socket.username]) {
			var userRef = firebase.db.ref(firebase.roomsPath + socket.gameroom + '/users/' + socket.username);
			userRef.remove();

			if(users.length === 1) {
				deleteActiveGame(socket.gameroom);
			}

			delete socket.gameroom;
		}
	}
}


module.exports = {
	handler: handler,
	deleteUserFromRoom: deleteUserFromRoom
}