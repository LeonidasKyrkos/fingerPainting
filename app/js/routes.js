import React from 'react';
import {Route} from 'react-router';

import App from './components/General/App';
import RoomPicker from './components/General/RoomPicker';
import GameRoom from './components/General/GameRoom';
import AdminPanel from './components/Admin/AdminPanel';

export default (
	<Route>
		<Route component={App}>
			<Route path="/" component={RoomPicker} />
			<Route path='/rooms/:roomId' component={GameRoom} />
		</Route>
		<Route path='/admin' component={AdminPanel} />
	</Route>
);