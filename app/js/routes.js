import React from 'react';
import {Route} from 'react-router';

import App from './components/App';
import RoomPicker from './components/RoomPicker';
import Home from './components/Home';

export default (
	<div>
		<Route component={App}>
			<Route path="/" component={Login} />
		</Route>
		<Route path='/games' component={Home} />
	</div>
);