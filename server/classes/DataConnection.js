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

	updateRoom(id,update) {
		firebase.db.ref(firebase.roomsPath).child(id).update(update);
	}

	spawnRoom(room) {
		firebase.db.ref(firebase.roomsPath).push(room);
	}

	deleteRoom(id) {
		firebase.db.ref(firebase.roomsPath).child(id).remove();
	}

	watchDictionarys() {
		firebase.db.ref('/dictionarys').on('value',(snapshot)=>{
			let dictionarys = snapshot.val();
			this.events.emit('dictionarys',dictionarys);
		});
	}

	getDictionary(dictionary) {
		return new Promise((resolve, reject)=>{
			firebase.db.ref('/dictionarys/' + dictionary).once('value',(snapshot)=>{
				resolve(snapshot.val());
			});
		});		
	}

	addWord(dictionary) {
		firebase.db.ref('/dictionarys').child(dictionary).update(data[dictionary]);	
	}

	deleteWord(dictionary,word) {
		firebase.db.ref('/dictionarys').child(dictionary).child(word).remove();	
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