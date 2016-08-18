let firebase = require('../modules/firebaseConfig');

class DataConnection {
	constructor(roomId=0,eventDispatcher={}) {
		this.id = roomId;
		this.dbRef = firebase.db.ref(firebase.roomsPath + roomId);
		this.events = eventDispatcher;
	}

	watchRooms() {
		firebase.db.ref(firebase.roomsPath).on('value',(snapshot)=>{
			this.events.emit('rooms',snapshot.val());
		});
	}

	unwatchRooms() {
		firebase.db.ref(firebase.roomsPath).off();
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

	updatePlayerTurns(player,turns) {
		this.dbRef.child('players').child(player).child('turns').set(turns);
	}

	setStore(store) {
		this.dbRef.set(store);
	}

	updatePlayers(players) {
		this.dbRef.child('players').set(players);
	}

	updatePlayer(player, obj) {
		this.dbRef.child('players').child(player).update(obj);
	}

	removePlayer(id) {
		this.dbRef.child('players').child(id).remove();
	}

	setChatLog(chatLog) {
		this.dbRef.child('/chatLog/').set(chatLog);
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