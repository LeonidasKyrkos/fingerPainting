import React from 'react';
import { Router } from 'react-router';
import ReactDOM from 'react-dom';
import routes from './routes';
import createBrowserHistory from 'history/lib/createBrowserHistory';

let browserHistory = createBrowserHistory();

ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('app'));