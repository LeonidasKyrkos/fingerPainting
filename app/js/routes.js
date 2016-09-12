import React from 'react';
import {Route} from 'react-router';

import App from './components/Game/General/App';
import RoomPicker from './components/Game/General/RoomPicker';
import AdminPanel from './components/Admin/AdminPanel';
import Rooms from './components/Game/General/Rooms';
import GameRoom from './components/Game/General/GameRoom';
import Mailer from './components/Mailer/Mailer';
import Success from './components/Mailer/Success';

export default (
	<Route>
		<Route component={App}>
			<Route path="/" component={RoomPicker} />
			<Route path='/joining*' component={Rooms} />
			<Route path="/rooms/:gameId" component={GameRoom} />
		</Route>
		<Route path='/admin' component={AdminPanel} />
		<Route path='/contact' component={Mailer} />
		<Route path='/success' component={Success} />
	</Route>
);