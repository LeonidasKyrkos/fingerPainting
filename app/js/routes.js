import React from 'react';
import {Route} from 'react-router';

import App from './components/App';
import Login from './components/Login';
import Home from './components/Home';

export default (
	<div>
		<Route component={App}>
			<Route path="/" component={Login} />
		</Route>
		<Route path='/games' component={Home} />
	</div>
);