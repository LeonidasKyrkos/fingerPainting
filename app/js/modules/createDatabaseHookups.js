export default function createDatabaseHookups(roomId) {
	// users binding
	var config = {
		apiKey: "AIzaSyCtt1JaxaVKh5zzeMSLw4n53Iu2Fv20oXg",
		authDomain: "pictionareo.firebaseapp.com",
		databaseURL: "https://pictionareo.firebaseio.com",
		storageBucket: "pictionareo.appspot.com",
	};
	firebase.initializeApp(config);

	console.log('https://pictionareo.firebaseio.com' + '/rooms/' + roomId + '/users');

	var db = firebase.database();

	db.ref('/rooms/' + roomId + '/users').on('value',(snapshot)=>{
		console.log(snapshot.val());
	});
}