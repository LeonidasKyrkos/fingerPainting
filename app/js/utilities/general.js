export function painterTest(players,id) {
	for(let player in players) {
		if(player === id && players[player].status === 'painter') {
			return true;
		}
	}

	return false;
}