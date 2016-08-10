const firebase = require('../modules/firebaseConfig');
const io = require('../../configureServer').io;

function AdminPanel() {
	this.getDictionarys();
}

AdminPanel.prototype = {
	getDictionarys() {
		firebase.db.ref('/dictionarys').on('value',(snapshot)=>{
			this.dictionarys = snapshot.val();
			io.of('/admin').emit('dictionarys',this.dictionarys);
		});
	},

	newAdmin(socket) {
		socket.emit('dictionarys',this.dictionarys);

		socket.on('new word',(data)=>{
			let dictionary = Object.keys(data)[0];
			let word = Object.keys(data[dictionary])[0];

			if(Object.keys(this.dictionarys[dictionary]).indexOf(word) === -1) {
				firebase.db.ref('/dictionarys').child(dictionary).update(data[dictionary]);	
				socket.emit('success message',"'" + word + "'" + ' added to dictionary');
			} else {
				socket.emit('error message','Sorry - that word already exists in this dictionary');
			}
		});

		socket.on('delete word',(data)=>{
			let dictionary = data.dictionary;
			let word = data.word;

			firebase.db.ref('/dictionarys').child(dictionary).child(word).remove();	
		});
	}
}

module.exports = AdminPanel;