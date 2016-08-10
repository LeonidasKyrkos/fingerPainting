var firebase = require('./firebaseConfig');

function handler(roomId,player) {
	// update the users object of the requested room.
	firebase.roomsRef.child(roomId).child('players').child(player.id).set(player);
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