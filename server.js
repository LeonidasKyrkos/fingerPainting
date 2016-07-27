// custom modules
var utils = require('./server/modules/utilities');
var room = require('./server/modules/room');
var firebase = require('./server/modules/firebaseConfig');
var server = require('./configureServer');
var io = server.io;

// socket events
io.on('connection', function (socket) {
	socket.userId = socket.client.conn.id;
	socket.emit('connected',{ id: socket.userId });

	socket.on('join request',function(request){
		utils.joinHandler(request,socket);
	});

	socket.on('disconnect',function(){
		room.deleteUserFromRoom(socket);	
	});
});