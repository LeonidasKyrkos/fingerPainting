// utils
var path = require('path');
var logger = require('morgan');

// server
var port = 443;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);



// configure server
server.listen(port);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/rooms/*',function(req, res){
	res.redirect('/');
})

app.get('/', function (req, res) {
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

var roomsPath = '/rooms/';
var roomsRef = db.ref(roomsPath);
var rooms = [];


roomsRef.on('value',function(snapshot){
	rooms = snapshot.val();
});

// socket events
io.on('connection', function (socket) {
	socket.username = (new Date()).getTime();
	socket.emit('connected',socket.username);

	socket.on('join request',function(request){
		// run some room tests (room existence / user.name / password)
		var status = roomTests(request,socket);

		if(status.status) {			
			gameroomHandler(request,socket);			

			// store gamerooms array in socket data
			socket.gamerooms = socket.gamerooms || [];
			socket.gamerooms.push(request.id);
			
			// inform the client that they can redirect to the room and hand them the database reference.
			socket.emit('request accepted',{ room: roomsPath + request.id, user: { id: socket.username, name: request.name } })

			
		} else {
			// inform the client that they're a fucking jerk and let them know why.
			socket.emit('request rejected',{ errors: status.reason });
		}
	});

	socket.on('disconnect',function(){
		deleteUserFromRoom(socket)
	});
});

// UTILITIES

function gameroomHandler(request,socket) {
	// update the users object of the requested room.
	updateReference(request.id + '/users/' + socket.username + '/name/', request.name);

	// update gameroom status [playing/not playing]
	var room = rooms[request.id];

	if(room.users && Object.keys(room.users).length === 1) {
		updateReference(request.id + '/users/' + socket.username + '/status/', 'captain');
	}
}

function updateReference(path,updVal) {
	var obj = {};
	obj[path] = updVal;

	roomsRef.update(obj);
}

function deleteUserFromRoom(socket) {
	if(socket.gamerooms) {
		socket.gamerooms.forEach(function(room){
			var users = rooms[room].users;

			if(users[socket.username]) {
				var userRef = db.ref(roomsPath + room + '/users/' + socket.username);
				userRef.remove();
				socket.gamerooms.slice(socket.gamerooms.indexOf(room),1);
			}
		});
	}
}


// room joining tests

function roomTests(request,socket) {
	var room = rooms[request.id];

	if(!room) { return { status: false, reason: 'Room not found or password incorrect' } }

	var tests = {
		password: {
			func: testCompare,
			args: [room.password, request.password, 'Room number not found or password incorrect']
		},
		name: {
			func: testIn,
			args: [room.users, socket.username, 'Sorry there is already someone called ' + request.name + ' in that room. Please choose another name.']
		}
	}

	for(var test in tests) {
		var func = tests[test].func;
		var args = tests[test].args;

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
	if(args[0]) {
		for(var prop in args[0]) {
			if(args[1] === prop) {
				return { status: false,  reason: args[2] };
			}
		}		
	}

	return { status: true };	
}

function testInSecondLevel(args) {
	for(var prop in args[0]) {
		if(args[1] === args[0][prop].id) {
			return { status: false,  reason: args[2] };
		}
	}

	return { status: true };	
}

/////// end of tests ////////



















