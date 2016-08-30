function trueFalse(obj) {
	for(let item in obj) {
		console.log(obj[item] ? 'true' : 'false');
	}
}

module.exports = {
	trueFalse: trueFalse
}