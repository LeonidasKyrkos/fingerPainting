let firebase = require('../modules/firebaseConfig');

class DataConnection {
	constructor(roomId,eventDispatcher) {
		this.id = roomId;
		this.dbRef = firebase.db.ref(firebase.roomsPath + roomId);
		this.events = eventDispatcher;
	}

	getDictionary(dictionary) {
		return new Promise((resolve, reject)=>{
			firebase.db.ref('/dictionarys/' + dictionary).once('value',(snapshot)=>{
				resolve(snapshot.val());
			});
		});		
	}

	listenToData() {
		this.dbRef.on('value',(snapshot)=>{
			this.events.emit('store',snapshot.val());
		});
	}

	setStatus(status) {
		this.dbRef.update({
			status: status
		});
	}

	setPlayerStatus(player,status) {
		this.dbRef.child('players').child(player).update({
			status: status
		})
	}

	updatePlayer(player, obj) {
		this.dbRef.child('players').child(player).update(obj);
	}

	removePlayer(id) {
		this.dbRef.child('players').child(id).remove();
	}

	pushMessage(message) {
		this.dbRef.child('/chatLog/').push(message);
	}

	updateTimer(timer) {
		this.dbRef.update({
			clock: timer
		})
	}

	clearChat() {
		this.dbRef.child('chatLog').remove();
	}
}

module.exports = DataConnection;