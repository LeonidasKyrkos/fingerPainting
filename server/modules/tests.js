var firebase = require('./firebaseConfig');

// room joining tests

function roomTests(request,socket) {
	var room = firebase.rooms[request.id];

	if(!room) { return { status: false, reason: 'Room not found or password incorrect' } }

	var tests = {
		password: {
			func: testCompare,
			args: [room.password, request.password, 'Room number not found or password incorrect']
		},
		name: {
			func: testIn,
			args: [room.players, request.name, 'Sorry there is already someone called ' + request.name + ' in that room. Please choose another name.']
		}
	}

	for(var test in tests) {
		var func = tests[test].func;
		var args = tests[test].args;

		if(!func(args).status) {
			return func(args);
		}
	}

	return { status: true };
}

function testExists(args) {
	if(args[0]) {
		return { status: true };
	} else {
		return { status: false, reason: args[1] };
	}
}

function testCompare(args) {
	if(args[0] === args[1]) {
		return { status: true };
	} else {
		return { status: false, reason: args[2] };
	}
}

function testIn(args) {
	if(args[0]) {
		for(var prop in args[0]) {
			if(args[1] === args[0][prop].name) {
				return { status: false,  reason: args[2] };
			}
		}		
	}

	return { status: true };	
}

function testInSecondLevel(args) {
	for(var prop in args[0]) {
		if(args[1] === args[0][prop].id) {
			return { status: false,  reason: args[2] };
		}
	}

	return { status: true };	
}

/////// end of tests ////////


module.exports = {
	roomTests: roomTests,
	testExists: testExists,
	testCompare: testCompare,
	testIn: testIn,
	testInSecondLevel: testInSecondLevel
}