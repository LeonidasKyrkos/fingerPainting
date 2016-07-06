// utils
var path = require('path');
var logger = require('morgan');

// server
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


// configure server
server.listen(port);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

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

var dictionaryRef = db.ref('dictionary/');
var dictionary = [];

var roomsRef = db.ref('rooms/');
var rooms = [];

// configure firebase data listeners
dictionaryRef.once('value',function(snapshot) {
	dictionary = snapshot.val();
	io.sockets.emit('dictionary',dictionary);
}, function(err) {
	io.sockets.emit('error','Could not load dictionary - please complain to Leo');
});

roomsRef.on('value',function(snapshot){
	rooms = snapshot.val();
});



// socket events
io.on('connection', function (socket) {
	socket.emit('connected');

	socket.on('user',function(username){
		socket.username = username;
	});

	socket.on('join request',function(request){
		let status = roomTests(request);

		if(status.status) {
			socket.emit('request accepted',{ firebase: 'https://pictionareo.firebaseio.com/rooms/' +  request.id, room: request.id })
		} else {
			socket.emit('request rejected',{ errors: status.reason });
		}
	});

	if(dictionary) {
		socket.emit('dictionary',dictionary);
	}	
});

// UTILITIES

// room joining tests

function roomTests(request) {
	var room = rooms[request.id];

	if(!room) { return { status: false, reason: `Room not found or password incorrect` } }

	var tests = {
		password: {
			func: testCompare,
			args: [room.password, request.password, `Room number not found or password incorrect`]
		},
		name: {
			func: testIn,
			args: [room.users, request.name, 'Sorry there is already someone called ' + request.name + ' in that room. Please choose another name.']
		}
	}

	for(var test in tests) {
		let func = tests[test].func;
		let args = tests[test].args;

		if(!func(args).status) {
			return func(args);
		}
	}

	return { status: true };
}

function testExists(args) {
	if(args[0]) {
		return { status: true };
	} else {
		return { status: false, reason: args[1] };
	}
}

function testCompare(args) {
	if(args[0] === args[1]) {
		return { status: true };
	} else {
		return { status: false, reason: args[2] };
	}
}

function testIn(args) {
	for(var prop in args[0]) {
		if(args[1] === prop) {
			return { status: false,  reason: args[2] };
		}
	}
	return { status: true };
}

/////// end of tests ////////








