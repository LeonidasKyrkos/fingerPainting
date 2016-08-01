var firebase = require('./firebaseConfig');

function handler(request,socket) {
	// update the users object of the requested room.
	firebase.roomsRef.child(request).child('users').child(socket.userId).update({
		name: socket.name,
		score: 0
	});

	// update gameroom status [playing/not playing]
	var room = firebase.rooms[request];

	if(room.users && Object.keys(room.users).length === 1) {
		// update database reference and inform user that they're the captain
		updateReference(request + '/users/' + socket.userId + '/status/', 'captain');
		socket.emit('promotion');
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