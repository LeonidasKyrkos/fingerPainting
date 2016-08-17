// custom modules
var utils = require('./server/modules/utilities');
var firebase = require('./server/modules/firebaseConfig');
var io = require('./configureServer').io;
var AdminPanel = require('./server/classes/AdminPanel');
var adminPanel = new AdminPanel();
var adminSocket = io.of('/admin');
var DataConnection = require('./server/classes/DataConnection');
let Eev = require  ('eev'); 
let e = new Eev(); // event emitter
let data = new DataConnection(0,e);
let roomPickers = {};

e.on('rooms',updateRoomStore);
data.watchRooms();

// socket events
io.on('connection', (socket)=>{
	socket.userId = socket.client.conn.id;
	socket.emit('connected',{ id: socket.userId });
	roomPickers[socket.userId] = socket;

	socket.on('join request',(request)=>{
		utils.joinHandler(request,socket);
	});

	socket.on('joined room',()=>{
		delete roomPickers[socket.userId];
	});
});

adminSocket.on('connection',(socket)=>{
	adminPanel.newAdmin(socket);
});


function updateRoomStore(store) {
	let roomStore = store;

	for(let room in roomStore) {
		delete roomStore[room].password;
	}

	emitToAllSockets('rooms',roomStore);
}

function emitToAllSockets(type,emission) {
	for(let socket in roomPickers) {
		roomPickers[socket].emit(type, emission);
	};
}