// custom modules
var utils = require('./server/modules/utilities');
var firebase = require('./server/modules/firebaseConfig');
var server = require('./configureServer');
var io = server.io;

// socket events
io.on('connection', function (socket) {
	socket.username = (new Date()).getTime();
	socket.emit('connected',socket.username);

	socket.on('join request',function(request){
		utils.joinHandler(request,socket);
	});

	socket.on('disconnect',function(){
		utils.deleteUserFromRoom(socket);	
	});
});