export function painterTest(players,id) {
	for(let player in players) {
		console.log(player,players)
		if(player === id && players[player].status === 'painter') {
			return true;
		}
	}

	return false;
}