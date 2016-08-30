// server stuff
const firebase = require('./server/modules/firebaseConfig');
const io = require('./configureServer').io;

// custom modules & classes
const utils = require('./server/modules/gameEntry');
const DataConnection = require('./server/classes/DataConnection');

// admin stuff
const AdminPanel = require('./server/classes/AdminPanel');
const adminPanel = new AdminPanel();
const adminSocket = io.of('/admin');

// event handling
const Eev = require  ('eev'); 
const e = new Eev(); // event emitter

// variable instantiation
const data = new DataConnection(0,e);
const roomPickers = {};
let roomStore;


// watch rooms and create store
e.on('rooms',updateRoomStore);
data.watchRooms();


// socket events
io.on('connection', (socket)=>{
	socket.userId = socket.client.conn.id;
	socket.emit('connected',{ id: socket.userId });
	roomPickers[socket.userId] = socket;
	socket.emit('rooms',roomStore);

	socket.on('join request',(request)=>{
		utils.joinHandler(request,socket);
	});

	socket.on('rooms request',()=>{
		utils.roomsHandler(socket);
	});

	socket.on('joined room',()=>{
		delete roomPickers[socket.userId];

		if(!Object.keys(roomPickers).length) {
			data.unwatchRooms();
		}
	});
});

adminSocket.on('connection',(socket)=>{
	adminPanel.newAdmin(socket);
});


function updateRoomStore(store) {
	roomStore = store;

	for(let room in roomStore) {
		if(roomStore[room].password) {
			roomStore[room].password = '🔒';
		} else {
			roomStore[room].password = '';
		}		
	}

	emitToAllSockets('rooms',roomStore);
}

function emitToAllSockets(type,emission) {
	for(let socket in roomPickers) {
		roomPickers[socket].emit(type, emission);
	};
}