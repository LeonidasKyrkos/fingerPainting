import React from 'react';
import {Route} from 'react-router';

import App from './components/App';
import RoomPicker from './components/RoomPicker';
import GameRoom from './components/GameRoom';

export default (
	<Route component={App}>
		<Route path="/" component={RoomPicker} />
		<Route path='/rooms/:roomId' component={GameRoom} />
	</Route>		
);