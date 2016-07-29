// custom modules
var utils = require('./server/modules/utilities');
var firebase = require('./server/modules/firebaseConfig');
var io = require('./configureServer').io;
var AdminPanel = require('./server/classes/AdminPanel');
var adminPanel = new AdminPanel();
var adminSocket = io.of('/admin');

// socket events
io.on('connection', function (socket) {
	socket.userId = socket.client.conn.id;
	socket.emit('connected',{ id: socket.userId });

	socket.on('join request',function(request){
		utils.joinHandler(request,socket);
	});
});

adminSocket.on('connection',(socket)=>{
	adminPanel.newAdmin(socket);
});