var firebase = require('./firebaseConfig');

function handler(request,socket) {
	// update the users object of the requested room.
	updateReference(request + '/users/' + socket.userId + '/name/', socket.name);

	// update gameroom status [playing/not playing]
	var room = firebase.rooms[request];

	if(room.users && Object.keys(room.users).length === 1) {
		updateReference(request + '/users/' + socket.userId + '/status/', 'captain');
	}
}

function updateReference(path,updVal) {
	var obj = {};
	obj[path] = updVal;

	firebase.roomsRef.update(obj);
}

module.exports = {
	handler: handler,
	updateReference: updateReference
}