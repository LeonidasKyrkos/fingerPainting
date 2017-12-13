// configure firebase
var Firebase = require("firebase");

var config = {
	apiKey: "AIzaSyBFbvtUleyrWLQMUX4oo9N_y77U7thU6no",
    authDomain: "fingerpainting-a2590.firebaseapp.com",
    databaseURL: "https://fingerpainting-a2590.firebaseio.com",
    projectId: "fingerpainting-a2590",
    storageBucket: "fingerpainting-a2590.appspot.com",
    messagingSenderId: "266437389910"
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