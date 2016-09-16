let firebase = require('../modules/firebaseConfig');

class DataConnection {
	constructor(App={}) {
		this.App = App;
		this.id = this.App.id;
		this.dbRef = firebase.db.ref(firebase.roomsPath + this.id);
		this.events = this.App.events;
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

	addPlayer(roomId,player) {
		firebase.roomsRef.child(roomId).child('players').child(player.id).set(player);
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

	addWord(dictionary,word) {
		let obj = {};
		obj[word] = word;
		firebase.db.ref('/dictionarys').child(dictionary).update(obj);
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

	resetPlayers() {
		this.dbRef.child('players').remove();
	}

	setStore(store) {
		this.dbRef.set(store);
	}

	updatePlayers(players) {
		this.dbRef.child('players').set(players);
	}

	updatePlayer(playerId, obj) {
		this.dbRef.child('players').child(playerId).update(obj);
	}

	setPlayer(playerId) {
		this.dbRef.child('players').child(playerId).set(player);
	}	

	removePlayer(playerId) {
		this.dbRef.child('players').child(playerId).remove();
	}

	setChatLog(chatLog) {
		this.dbRef.child('/chatLog/').set(chatLog);
	}

	setChild(child,value) {
		this.dbRef.child(child).set(value);
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