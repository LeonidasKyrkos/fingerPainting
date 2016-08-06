import React from 'react';
import { Router } from 'react-router';
import ReactDOM from 'react-dom';
import routes from './routes';
import { browserHistory } from 'react-router';

ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('app'));