import React from 'react';
import {Route} from 'react-router';

import App from './components/General/App';
import RoomPicker from './components/General/RoomPicker';
import AdminPanel from './components/Admin/AdminPanel';
import Rooms from './components/General/Rooms';
import GameRoom from './components/General/GameRoom';

export default (
	<Route>
		<Route component={App}>
			<Route path="/" component={RoomPicker} />
			<Route path='/joining*' component={Rooms} />
			<Route path="/rooms/:gameId" component={GameRoom} />
		</Route>
		<Route path='/admin' component={AdminPanel} />
	</Route>
);