function captainTest(players,id) {
	for(let player in players) {
		if(player === id && players[player].status === 'captain') {
			return true;
		}
	}

	return false;
}