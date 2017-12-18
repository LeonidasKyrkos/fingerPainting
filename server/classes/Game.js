const io = require('../../configureServer').io;
const _ = require('lodash');

// event library
const Eev = require('eev');

// GAME MODULES
//--------------
const DataConnection = require('./DataConnection'); // for setting and getting remotely [DB] stored data
const Initialisation = require('../modules/game/Initialisation'); // Set up and initialise the game
const ClientComms = require('../modules/game/ClientCommunication'); // handler for client communications
const SetGetters = require('../modules/game/SetGetters'); // for setting and getting locally stored data
const PlayerHandler = require('../modules/game/PlayerHandler'); // handler for player methods
const Fingerpainting = require('../modules/game/Fingerpainting'); // FP game class. Should be replaceable with other games in the future.
const Tests = require('../modules/game/Tests'); // Got something to test? use this appropriately named class

// settings
const gameDefaults = {
	store: {
		status: 'pending',
	},
	sockets: {},
	inactivePlayers: {},
	garbageQueue: [],
	settings: {
		gameLength: 90,
		rounds: 3,
		minimumPlayers: 3, // testing value. 3 on live
		blockUpdates: false,
		timer: 90
	}
}

// Fingerpainting game class
class Game {
	constructor(id){
		this.id = id;
		this.game = Object.assign({}, gameDefaults);
		this.events = new Eev();
		this.data = new DataConnection(this);
		this.setGetters = new SetGetters(this);
		this.tests = new Tests(this);
		this.clientComms = new ClientComms(this);
		this.playerHandler = new PlayerHandler(this);
		this.fingerPainting = new Fingerpainting(this);
		this.init = new Initialisation(this);

		// set up our listeners
		this.initEventHandlers();
	}

	initEventHandlers() {
		// When the store has updated we'll do the same for the players. We'll also update their player objects.
		this.events.on('store_updated',()=>{
			this.clientComms.emitToAllSockets('store update', this.game.store);
			this.clientComms.updateClientPlayerObject();
		});

		// When a new player joins emit their player information and the roomId
		// passed data = { socket: socket, msg: player }
		this.events.on('new_player',(data)=>{
			this.data.addPlayer(this.id,data.msg);
			this.clientComms.emitToSocket(data.socket, 'join room', '/rooms/' + this.id);
			this.clientComms.emitToSocket(data.socket, 'player', data.msg);
		});

		// When the painter sends a path update, send it through to all the other players
		this.events.on('path_update',(paths)=>{
			this.clientComms.emitToAllGuessers('path update', paths);
		});

		// Start round
		this.events.on('start_round',()=>{
			this.fingerPainting.startRound();
		})

		// Message received from client. If we're not in a blocking state then pass the msg to the game handler
		// to compare it against the current puzzle
		this.events.on('message',(msg)=>{
			if(!this.game.settings.blockUpdates) {
				this.fingerPainting.parseMsg(msg);
			}
		})

		// Our painter has left unexpectedly and we need to find a new painter
		this.events.on('new_painter_required',()=>{
			this.fingerPainting.findNewPainter();
		});

		// Something has caused the game to be unable to continue to inform the game handler
		this.events.on('end_round',()=>{
			this.fingerPainting.endRound();
		});
	}
}

module.exports = Game;