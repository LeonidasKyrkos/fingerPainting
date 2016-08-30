const tests = require('./tests');
const firebase = require('./firebaseConfig');
const Game = require('../classes/Game');
const Player = require('../classes/Player');
const _ = require('lodash');
const url = require('url');
const querystring = require('querystring');
const debugging = require('./debugging');
let activeGames = {};
let rooms = {};
let instantiated = false;

firebase.roomsRef.on('value',(snapshot)=>{
	rooms = snapshot.val();

	if(!instantiated) {
		instantiated = true;
		instantiateRooms(rooms);
		return;
	}

	let roomsArr = Object.keys(rooms);
	let activeGamesArr = Object.keys(activeGames);

	if(roomsArr.length < activeGamesArr.length) {
		deleteGames(roomsArr,activeGamesArr)
	}

	if(roomsArr.length > activeGamesArr.length) {
		addNewGames(roomsArr,activeGamesArr);
	}
});

function deleteGames(roomsArr,activeGamesArr) {
	_.difference(activeGamesArr,roomsArr).forEach((item,index)=>{
		delete activeGames[item];
	});
}

function addNewGames(roomsArr,activeGamesArr) {
	_.difference(roomsArr,activeGamesArr).forEach((item,index)=>{
		let obj = {};
		obj[item] = item;
		instantiateRooms(obj);
	});
}

// GAMES ACTIONS

function joinHandler(request,socket){
	// run some room tests (room existence / user.name / password)
	let status = tests.roomTests(request,socket,rooms);
	let cookie = socket.request.cookies['fingerpainting_refresh_token'] || '';

	if(status.status) {
		// setup
		let player = new Player(request,socket,cookie);
		let game = activeGames[request.id];
		let room = rooms[request.id];

		// hand client their user credentials.
		socket.emit('user update',player);

		if(room.status === 'pending' || tests.inactivePlayer(cookie,game)) {
			game.newPlayer(player,socket);
		} else {
			socket.emit('request rejected','Sorry that room has a game underway');
		}
		
	} else {
		// inform the client that they're a fucking jerk and let them know why.
		socket.emit('request rejected',status.reason);
	}
}

function roomsHandler(socket) {
	let cookie = socket.request.cookies['fingerpainting_refresh_token'] || '';
	let urlObject = url.parse(socket.handshake.headers.referer);
	let query = querystring.parse(urlObject.query);
	let roomId = query.room;
	let game = activeGames[roomId];

	if(game && cookie && roomId && tests.inactivePlayer(cookie,game)) {
		let name = game.inactivePlayers[cookie].name;
		let player = new Player({ name: name, id: roomId }, socket, cookie);

		// hand client their user credentials.
		socket.emit('user update',player);

		game.newPlayer(player,socket);
	} else {
		socket.emit('redirect','/');
	}
}

function instantiateRooms(rooms) {
	for(let id in rooms) {
		let game = new Game(id);
		activeGames[id] = game;
	}
}


function deleteActiveGame(id) {
	var index = activeGames.indexOf(id);

	if(index !== -1) {		
		activeGames.splice(index,1);
	}
}

// end of utils //

module.exports = {
	joinHandler: joinHandler,
	deleteActiveGame: deleteActiveGame,
	roomsHandler: roomsHandler
}