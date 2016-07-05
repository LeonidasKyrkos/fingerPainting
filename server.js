var Firebase = require("firebase");
var path = require('path');
var logger = require('morgan');
var port = process.env.PORT || 3000;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(port);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	
	socket.on('my other event', function (data) {
		console.log(data);
	});
});
