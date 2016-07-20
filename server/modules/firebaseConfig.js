// configure firebase
var Firebase = require("firebase");

var config = {
	apiKey: "AIzaSyCtt1JaxaVKh5zzeMSLw4n53Iu2Fv20oXg",
	authDomain: "pictionareo.firebaseapp.com",
	databaseURL: "https://pictionareo.firebaseio.com",
	storageBucket: "pictionareo.appspot.com",
};

Firebase.initializeApp(config);

// configure firebase references
var db = Firebase.database();

var roomsPath = '/rooms/';
var roomsRef = db.ref(roomsPath);
var rooms = [];

module.exports = {
	db: db,
	roomsPath: roomsPath,
	roomsRef: roomsRef,
	rooms: rooms
}