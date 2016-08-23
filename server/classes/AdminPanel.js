const firebase = require('../modules/firebaseConfig');
const io = require('../../configureServer').io;
const DataConnection = require('./DataConnection');
const Eev = require  ('eev'); 
const e = new Eev(); // event emitter

class AdminPanel {
	constructor() {
		this.data = new DataConnection(0,e);
		this.init();
	}

	init() {
		this.data.watchDictionarys();
		this.data.watchRooms();

		e.on('dictionarys',(dictionarys)=>{
			this.dictionarys = dictionarys;
			this.emitToAdmins('dictionarys',dictionarys);
		});

		e.on('rooms',(rooms)=>{
			this.rooms = rooms;
			this.emitToAdmins('rooms',rooms)
		});
	}

	newAdmin(socket) {
		socket.emit('dictionarys',this.dictionarys);
		socket.emit('rooms',this.rooms);
		socket.emit('debug',this.dictionarys);

		socket.on('new word',(data)=>{
			let dictionary = Object.keys(data)[0];
			let word = Object.keys(data[dictionary])[0];

			if(Object.keys(this.dictionarys[dictionary]).indexOf(word) === -1) {
				this.data.addWord(dictionary,word);
				socket.emit('success message',"'" + word + "'" + ' added to dictionary');
			} else {
				socket.emit('error message','Sorry - that word already exists in this dictionary');
			}
		});

		socket.on('delete word',(data)=>{
			let dictionary = data.dictionary;
			let word = data.word;

			this.data.deleteWord(dictionary,word);
		});

		socket.on('room update',(data)=>{
			let id = data.id;
			let update = {};
			update[data.type] = data.value;

			this.data.updateRoom(id,update);
		});

		socket.on('spawn room',(room)=>{
			this.data.spawnRoom(room);
		});

		socket.on('delete room',(id)=>{
			this.data.deleteRoom(id);
		});
	}

	emitToAdmins(type,emission) {
		io.of('/admin').emit(type,emission);
	}
}

module.exports = AdminPanel;
