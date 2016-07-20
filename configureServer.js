// server
var path = require('path');
var logger = require('morgan');
var port = 443;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// configure server
server.listen(port);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/rooms/*',function(req, res){
	res.redirect('/');
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

module.exports = {
	io: io
}