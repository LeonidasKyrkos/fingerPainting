import React from 'react';
import {Route} from 'react-router';

import App from './components/App';
import RoomPicker from './components/RoomPicker';
import Home from './components/Home';

export default (
	<Route component={App}>
		<Route path="/" component={RoomPicker} />
		<Route path='/home' component={Home} />
	</Route>		
);