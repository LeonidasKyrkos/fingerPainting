// server
var path = require('path');
var logger = require('morgan');
var port = 443;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io',{ rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] })(server);
var basicAuth = require('basic-auth');

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
	res.redirect('/');
})

app.get('/admin', auth, function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

module.exports = {
	io: io
}