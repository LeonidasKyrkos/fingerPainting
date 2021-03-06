// room joining tests

function roomTests(request,socket,rooms) {
	var room = rooms[request.id];

	if(!room) { return { status: false, reason: 'Room not found' } }

	var tests = {
		name: {
			func: testIn,
			args: [room.players, request.name, 'Sorry there is already someone called ' + request.name + ' in that room. Please choose another name.']
		}
	}

	if(room.password) {
		tests['password'] = {
			func: testCompare,
			args: [room.password, request.password, 'Invalid password']
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

function testInArray(thingWeLookFor,array) {
	return array.some((thingWeLookFor, index, array)=>{
		return thingWeLookFor === array[index];
	})
}

function inactivePlayer(cookie,Instance) {
	return Instance.game.inactivePlayers[cookie] ? true : false;
}

/////// end of tests ////////


module.exports = {
	roomTests: roomTests,
	testExists: testExists,
	testCompare: testCompare,
	testIn: testIn,
	inactivePlayer: inactivePlayer
}