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
const data = new DataConnection({ id: 0, events: e });
let roomStore;


// watch rooms and create store
e.on('rooms',updateRoomStore);
data.watchRooms();


// socket events
io.on('connection', (socket)=>{
	socket.userId = socket.client.conn.id;
	socket.emit('connected',{ id: socket.userId });
	socket.emit('rooms',roomStore);

	socket.on('join request',(request)=>{
		utils.joinHandler(request,socket);
	});

	socket.on('rooms request',()=>{
		utils.roomsHandler(socket);
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

	io.emit('rooms',roomStore);
}