import React from 'react';
import { Router } from 'react-router';
import ReactDOM from 'react-dom';
import routes from './routes';
import createBrowserHistory from 'history/lib/createBrowserHistory';

var socket = io.connect('http://localhost:3000');

socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});

let browserHistory = createBrowserHistory();

ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('app'));