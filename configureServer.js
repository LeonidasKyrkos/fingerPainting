// server
const path = require('path');
const logger = require('morgan');
const port = 3000;
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io',{ rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] })(server);
const basicAuth = require('basic-auth');
const cookieParser = require('socket.io-cookie-parser');
const expCookieParser = require('cookie-parser');
const reconToken = 'fingerpainting_refresh_token';

io.use(cookieParser());
app.use(expCookieParser());

// configure server
server.listen(port);

var auth = function (req, res, next) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.sendStatus(401);
	};

	var user = basicAuth(req);

	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	};

	if (user.name === 'admin' && user.pass === 'chuckberry') {
		return next();
	} else {
		return unauthorized(res);
	};
};

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/rooms/*',function(req, res){
	let cookie = getCookie(req,reconToken);
	let gameId = req.params[0];

	if(!cookie) {
		res.redirect('/');
	} else {
		res.redirect('/rejoin/'+gameId)
	}	
})

app.get('/rejoin*', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/admin', auth, function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/', function (req, res) {
	let cookie = getCookie(req,reconToken)

	if (!cookie){
		// no: set a new cookie
		let timestamp = (new Date()).getTime();
		let random = Math.random().toString();

		res.cookie(reconToken, timestamp, { maxAge: 900000, httpOnly: true });
	} 

	res.sendFile(__dirname + '/views/index.html');
});

function getCookie(req,name) {
	let cookie = req.cookies[name];

	return cookie;
}

module.exports = {
	io: io
}