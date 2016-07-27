(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Actions = function () {
	function Actions() {
		_classCallCheck(this, Actions);
	}

	_createClass(Actions, [{
		key: 'updateStore',
		value: function updateStore(data) {
			return data;
		}
	}, {
		key: 'updateSocket',
		value: function updateSocket(socket) {
			return socket;
		}
	}, {
		key: 'updateUser',
		value: function updateUser(user) {
			return user;
		}
	}, {
		key: 'updatePuzzle',
		value: function updatePuzzle(puzzle) {
			return puzzle;
		}
	}]);

	return Actions;
}();

exports.default = _alt2.default.createActions(Actions);

},{"../alt":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alt = require('alt');

var _alt2 = _interopRequireDefault(_alt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _alt2.default();

},{"alt":"alt"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Actions = require('../actions/Actions');

var _Actions2 = _interopRequireDefault(_Actions);

var _Store = require('../stores/Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var socket = io.connect('http://localhost:3000');

var App = function (_Component) {
	_inherits(App, _Component);

	function App(props) {
		_classCallCheck(this, App);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));

		_this.state = _Store2.default.getState();
		return _this;
	}

	_createClass(App, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			socket.on('connected', function (user) {
				_Actions2.default.updateSocket(socket);
			});

			socket.on('store update', function (store) {
				_Actions2.default.updateStore(store);
			});

			socket.on('countdown', function (data) {
				console.log(data);
			});

			socket.on('round end', function () {
				console.log('ended');
			});

			socket.on('correct', function () {
				console.log('correct!');
			});

			socket.on('puzzle', function (puzzle) {
				_Actions2.default.updatePuzzle(puzzle);
			});

			_Store2.default.listen(this.onChange.bind(this));
		}
	}, {
		key: 'onChange',
		value: function onChange(state) {
			if (state.store.currentRoom !== this.state.store.currentRoom) {
				this.setState(state);
				this.joinRoom(state.store.currentRoom);
			}
		}
	}, {
		key: 'requestJoin',
		value: function requestJoin(name, id, password) {
			socket.emit('join request', { name: name, id: id, password: password });
		}
	}, {
		key: 'joinRoom',
		value: function joinRoom(room) {
			this.props.history.push(room);
		}
	}, {
		key: 'renderChildren',
		value: function renderChildren() {
			var _this2 = this;

			var childrenWithProps = _react2.default.Children.map(this.props.children, function (child) {
				return _react2.default.cloneElement(child, {
					requestJoin: _this2.requestJoin
				});
			});

			return childrenWithProps;
		}
	}, {
		key: 'render',
		value: function render() {
			var children = this.renderChildren();

			return _react2.default.createElement(
				'div',
				null,
				children
			);
		}
	}]);

	return App;
}(_react.Component);

exports.default = App;

},{"../actions/Actions":1,"../stores/Store":17,"react":"react"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CanvasSettings = require('./CanvasSettings');

var _CanvasSettings2 = _interopRequireDefault(_CanvasSettings);

var _Store = require('../stores/Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Canvas = function (_Component) {
	_inherits(Canvas, _Component);

	function Canvas(props) {
		_classCallCheck(this, Canvas);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Canvas).call(this, props));

		_this.state = _Store2.default.getState();
		_this.setPlayerStatus();
		_this.points = [];

		_this.onChange = _this.onChange.bind(_this);
		return _this;
	}

	_createClass(Canvas, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_Store2.default.listen(this.onChange);
			this.setupCanvas();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_Store2.default.unlisten(this.onChange);
		}
	}, {
		key: 'onChange',
		value: function onChange(state) {
			this.setState(state);
		}
	}, {
		key: 'setPlayerStatus',
		value: function setPlayerStatus() {
			var user = this.state.store.users[this.state.socket.id] || {};
			if (user.status === 'captain') {
				this.state.player = true;
			} else {
				this.state.player = false;
			}
		}
	}, {
		key: 'setupCanvas',
		value: function setupCanvas() {
			this.canvas = document.querySelector('#canvas');
			this.canvas.setAttribute('width', this.canvas.parentElement.offsetWidth);
			this.ctx = this.canvas.getContext('2d');
			this.ctx.strokeStyle = "#FFFFFF";
			this.ctx.shadowColor = "#FFFFFF";
			this.ctx.shadowBlur = 0;
			this.ctx.lineJoin = "round";
			this.ctx.lineWidth = 5;
			this.ctx.translate(0.5, 0.5);
		}

		// start

	}, {
		key: 'startDrawing',
		value: function startDrawing(e) {
			this.painting = true;
			this.current = this.points.length || 0;
			this.clearArrays();
			this.addToArray(this.getX(e), this.getY(e), false);
		}

		// drag

	}, {
		key: 'dragBrush',
		value: function dragBrush(e) {
			if (this.painting) {
				if (this.points.length > 30) {
					var prevArr = this.points;
					this.current++;
					this.clearArrays();

					var obj = prevArr[prevArr.length - 1];
					var counter = 0;

					for (var i = prevArr.length - 8; i < prevArr.length - 1; i++) {
						this.points[counter] = prevArr[i];
						counter++;
					}
				}

				this.addToArray(this.getX(e), this.getY(e), true);
			}
		}

		// finish

	}, {
		key: 'stopDrawing',
		value: function stopDrawing() {
			this.painting = false;
		}

		// UTILITIES

		// get x coordinate

	}, {
		key: 'getX',
		value: function getX(e) {
			this.canvasX = this.canvas.offsetLeft;
			return e.pageX - this.canvasX;
		}

		// get y coordinate

	}, {
		key: 'getY',
		value: function getY(e) {
			this.canvasY = this.canvas.offsetTop;
			return e.pageY - this.canvasY;
		}

		// add to points array

	}, {
		key: 'addToArray',
		value: function addToArray(mx, my, dragStatus) {
			this.points.push({
				x: mx,
				y: my,
				color: this.ctx.strokeStyle,
				size: this.ctx.lineWidth,
				dragging: dragStatus
			});

			this.pushPaths();
			this.redraw();
		}
	}, {
		key: 'pushPaths',
		value: function pushPaths() {
			this.state.socket.emit('path update', { path: this.points });
		}

		//client redraw function

	}, {
		key: 'redraw',
		value: function redraw() {
			var path = [];

			if (this.state.player) {
				path = this.points;
			} else if (this.state.store.paths) {
				path = this.state.store.paths.path;
			}

			if (!path.length) {
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				return;
			}

			if (path.length > 4) {
				this.ctx.beginPath();
				var item = path[0];
				var startX = item.x;
				var startY = item.y;

				this.ctx.moveTo(startX, startY);

				if (item.dragging || path[1].dragging) {
					this.renderPath(path);
				}
			} else {
				this.renderDot(path);
			}
		}

		// path renderer

	}, {
		key: 'renderPath',
		value: function renderPath(path) {
			var first = path[0];
			var length = path.length;

			for (var i = 0; i < path.length; i++) {
				var val = path[i];

				if (i > 0 && i < length - 2) {
					if (val.joined) {
						var x = (val.x + path[i + 1].x) / 2;
						var y = (val.y + path[i + 1].y) / 2;
					} else {
						var x = (val.x + path[i + 1].x) / 2;
						var y = (val.y + path[i + 1].y) / 2;
					}

					this.ctx.quadraticCurveTo(val.x, val.y, x, y);
				}

				this.ctx.lineWidth = first.size;
				this.ctx.strokeStyle = first.color;
				this.ctx.stroke();
			}
		}

		// line renderer

	}, {
		key: 'renderDot',
		value: function renderDot(path) {
			var obj = path;

			this.ctx.beginPath();
			this.ctx.arc(obj.x, obj.y, obj.size / 2, 0, 2 * Math.PI, false);
			this.ctx.fillStyle = obj.color;
			this.ctx.fill();
			this.ctx.closePath();
		}

		// clear the supplied context

	}, {
		key: 'clearContext',
		value: function clearContext(ctx) {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}

		// empty points array

	}, {
		key: 'clearArrays',
		value: function clearArrays() {
			this.points = [];
		}

		// empty contexts and points

	}, {
		key: 'fullClear',
		value: function fullClear() {
			this.clearContext(this.ctx);
			this.clearArrays();
			this.pushPaths();
		}

		// change the current stroke colour

	}, {
		key: 'updateColor',
		value: function updateColor(e) {
			var newColor = e.target.getAttribute('data-color');

			this.ctx.strokeStyle = newColor;
			this.ctx.shadowColor = newColor;
		}

		// change brush size

	}, {
		key: 'changeBrushSize',
		value: function changeBrushSize(e) {
			var newSize = e.target.getAttribute('data-size');
			this.ctx.lineWidth = newSize;
		}
	}, {
		key: 'render',
		value: function render() {
			this.setPlayerStatus();
			if (this.canvas) {
				this.canvasX = this.canvas.offsetLeft;
				this.canvasY = this.canvas.offsetTop;

				if (!this.state.player) {
					this.redraw();
				}
			}

			if (this.state.player) {
				var canvasSettings = _react2.default.createElement(_CanvasSettings2.default, {
					scope: this,
					fullClear: this.fullClear,
					changeBrushSize: this.changeBrushSize,
					updateColor: this.updateColor
				});

				var canvas = _react2.default.createElement('canvas', { width: '100', height: '600px', className: 'canvas', id: 'canvas',
					onMouseDown: this.startDrawing.bind(this),
					onMouseUp: this.stopDrawing.bind(this),
					onMouseLeave: this.stopDrawing.bind(this),
					onMouseMove: this.dragBrush.bind(this)
				});
			} else {
				var canvasSettings = '';
				var canvas = _react2.default.createElement('canvas', { width: '100', height: '600px', className: 'canvas', id: 'canvas' });
			}

			return _react2.default.createElement(
				'div',
				{ className: 'canvas__wrap' },
				canvasSettings,
				canvas
			);
		}
	}]);

	return Canvas;
}(_react.Component);

exports.default = Canvas;

},{"../stores/Store":17,"./CanvasSettings":5,"react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Store = require('../stores/Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CanvasSettings = function (_React$Component) {
	_inherits(CanvasSettings, _React$Component);

	function CanvasSettings(props) {
		_classCallCheck(this, CanvasSettings);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CanvasSettings).call(this, props));

		_this.onChange = _this.onChange.bind(_this);
		_this.state = _Store2.default.getState();
		return _this;
	}

	_createClass(CanvasSettings, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_Store2.default.listen(this.onChange);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_Store2.default.unlisten(this.onChange);
		}
	}, {
		key: 'onChange',
		value: function onChange(state) {
			this.setState(state);
		}
	}, {
		key: 'startGame',
		value: function startGame() {
			this.state.socket.emit('start round');
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.state.socket.emit('pause round');
		}
	}, {
		key: 'unpause',
		value: function unpause() {
			this.state.socket.emit('unpause round');
		}
	}, {
		key: 'getButton',
		value: function getButton() {
			if (this.state.store.status === 'pending') {
				return _react2.default.createElement(
					'button',
					{ className: 'canvas__settings-btn', onClick: this.startGame.bind(this) },
					'Start game'
				);
			}

			if (this.state.store.status === 'playing') {
				return _react2.default.createElement(
					'button',
					{ className: 'canvas__settings-btn', onClick: this.pause.bind(this) },
					'Pause game'
				);
			}

			if (this.state.store.status === 'paused') {
				return _react2.default.createElement(
					'button',
					{ className: 'canvas__settings-btn', onClick: this.unpause.bind(this) },
					'Unpause'
				);
			}

			return '';
		}
	}, {
		key: 'render',
		value: function render() {
			var scope = this.props.scope;
			var small = 3;
			var medium = 5;
			var large = 7;
			var huge = 12;

			var button = this.getButton();

			return _react2.default.createElement(
				'ul',
				{ className: 'canvas__settings' },
				_react2.default.createElement(
					'li',
					null,
					button
				),
				_react2.default.createElement(
					'li',
					null,
					_react2.default.createElement(
						'button',
						{ className: 'canvas__settings-btn', onClick: this.props.fullClear.bind(scope) },
						'Reset'
					)
				),
				_react2.default.createElement(
					'li',
					{ className: 'canvas__brush-sizes' },
					_react2.default.createElement(
						'ul',
						null,
						_react2.default.createElement(
							'li',
							{ className: 'ib' },
							_react2.default.createElement(
								'span',
								{ className: 'canvas__brush-size-wrap', 'data-size': small, onClick: this.props.changeBrushSize.bind(scope) },
								_react2.default.createElement('span', { className: 'canvas__brush-size', style: { width: small + 'px', height: small + 'px' } })
							)
						),
						_react2.default.createElement(
							'li',
							{ className: 'ib' },
							_react2.default.createElement(
								'span',
								{ className: 'canvas__brush-size-wrap', 'data-size': medium, onClick: this.props.changeBrushSize.bind(scope) },
								_react2.default.createElement('span', { className: 'canvas__brush-size', style: { width: medium + 'px', height: medium + 'px' } })
							)
						),
						_react2.default.createElement(
							'li',
							{ className: 'ib' },
							_react2.default.createElement(
								'span',
								{ className: 'canvas__brush-size-wrap', 'data-size': large, onClick: this.props.changeBrushSize.bind(scope) },
								_react2.default.createElement('span', { className: 'canvas__brush-size', style: { width: large + 'px', height: large + 'px' } })
							)
						),
						_react2.default.createElement(
							'li',
							{ className: 'ib' },
							_react2.default.createElement(
								'span',
								{ className: 'canvas__brush-size-wrap', 'data-size': huge, onClick: this.props.changeBrushSize.bind(scope) },
								_react2.default.createElement('span', { className: 'canvas__brush-size', style: { width: huge + 'px', height: huge + 'px' } })
							)
						)
					)
				),
				_react2.default.createElement(
					'li',
					{ className: 'canvas__colours' },
					_react2.default.createElement(
						'ul',
						null,
						_react2.default.createElement(
							'li',
							{ className: 'ib' },
							_react2.default.createElement('span', { 'data-color': '#FFFFFF', style: { backgroundColor: '#FFFFFF' }, className: 'canvas__colour', onClick: this.props.updateColor.bind(scope) })
						),
						_react2.default.createElement(
							'li',
							{ className: 'ib' },
							_react2.default.createElement('span', { 'data-color': '#d15d0a', style: { backgroundColor: '#d15d0a' }, className: 'canvas__colour', onClick: this.props.updateColor.bind(scope) })
						),
						_react2.default.createElement(
							'li',
							{ className: 'ib' },
							_react2.default.createElement('span', { 'data-color': '#FFFB21', style: { backgroundColor: '#FFFB21' }, className: 'canvas__colour', onClick: this.props.updateColor.bind(scope) })
						),
						_react2.default.createElement(
							'li',
							{ className: 'ib' },
							_react2.default.createElement('span', { 'data-color': '#363CFF', style: { backgroundColor: '#363CFF' }, className: 'canvas__colour', onClick: this.props.updateColor.bind(scope) })
						)
					)
				)
			);
		}
	}]);

	return CanvasSettings;
}(_react2.default.Component);

exports.default = CanvasSettings;


CanvasSettings.propTypes = {
	fullClear: _react.PropTypes.func.isRequired,
	changeBrushSize: _react.PropTypes.func.isRequired,
	updateColor: _react.PropTypes.func.isRequired,
	scope: _react.PropTypes.object.isRequired
};

},{"../stores/Store":17,"react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Store = require('../stores/Store');

var _Store2 = _interopRequireDefault(_Store);

var _Message = require('./Message');

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chat = function (_Component) {
	_inherits(Chat, _Component);

	function Chat() {
		_classCallCheck(this, Chat);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chat).call(this));

		_this.state = _Store2.default.getState();
		_this.onChange = _this.onChange.bind(_this);
		return _this;
	}

	_createClass(Chat, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_Store2.default.listen(this.onChange);
			this.chatHistory = document.querySelector('#chat-history');
			if (this.chatHistory) {
				this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
			};
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_Store2.default.unlisten(this.onChange);
		}
	}, {
		key: 'onChange',
		value: function onChange(state) {
			this.setState(state);
		}
	}, {
		key: 'parseChatForm',
		value: function parseChatForm(e) {
			e.preventDefault();
			var form = e.target;
			var input = form.querySelector('#chat-input');
			var msg = input.value;
			var chatHistory = document.querySelector('#chat-history');
			input.value = "";

			if (msg.length) {
				var timestamp = new Date().getTime();
				var data = {};
				data.id = this.state.socket.id;
				data.name = this.state.store.users[data.id].name;
				data.message = msg;
				data.timestamp = timestamp;
				this.state.socket.emit('message', data);
			}
		}
	}, {
		key: 'renderChats',
		value: function renderChats(chatLog) {
			return Object.keys(chatLog).map(function (item, index) {
				var chat = chatLog[item];
				return _react2.default.createElement(_Message2.default, { chat: chat, key: chat.timestamp });
			});
		}
	}, {
		key: 'render',
		value: function render() {
			this.chatLog = this.state.store.chatLog || {};
			this.chats = this.renderChats(this.chatLog);

			return _react2.default.createElement(
				'div',
				{ className: 'chat' },
				_react2.default.createElement(
					'div',
					{ id: 'chat-history', className: 'chat__history' },
					this.chats
				),
				_react2.default.createElement(
					'form',
					{ className: 'form--chat', onSubmit: this.parseChatForm.bind(this) },
					_react2.default.createElement('input', { autoComplete: 'off', id: 'chat-input', type: 'text', className: 'form__input' }),
					_react2.default.createElement(
						'button',
						{ className: 'btn--submit flex-right' },
						'»'
					)
				)
			);
		}
	}]);

	return Chat;
}(_react.Component);

exports.default = Chat;

},{"../stores/Store":17,"./Message":10,"react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Store = require('../stores/Store');

var _Store2 = _interopRequireDefault(_Store);

var _Scoreboard = require('./Scoreboard');

var _Scoreboard2 = _interopRequireDefault(_Scoreboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EndGame = function (_Component) {
	_inherits(EndGame, _Component);

	function EndGame(props) {
		_classCallCheck(this, EndGame);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EndGame).call(this, props));

		_this.onChange = _this.onChange.bind(_this);
		_this.state = _Store2.default.getState();
		return _this;
	}

	_createClass(EndGame, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_Store2.default.listen(this.onChange);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_Store2.default.unlisten(this.onChange);
		}
	}, {
		key: 'onChange',
		value: function onChange(state) {
			this.setState(state);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'game__over' },
				_react2.default.createElement(
					'h1',
					{ className: 'alpha' },
					'GAME OVER'
				),
				_react2.default.createElement(_Scoreboard2.default, null)
			);
		}
	}]);

	return EndGame;
}(_react.Component);

exports.default = EndGame;

},{"../stores/Store":17,"./Scoreboard":13,"react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Store = require('../stores/Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorMessage = function (_Component) {
	_inherits(ErrorMessage, _Component);

	function ErrorMessage(props) {
		_classCallCheck(this, ErrorMessage);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ErrorMessage).call(this, props));

		_this.state = _Store2.default.getState();
		_this.state.errors = '';

		_this.onChange = _this.onChange.bind(_this);
		return _this;
	}

	_createClass(ErrorMessage, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_Store2.default.listen(this.onChange);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_Store2.default.unlisten(this.onChange);
		}
	}, {
		key: 'onChange',
		value: function onChange(state) {
			var _this2 = this;

			this.setState(state);

			this.state.socket.on('request rejected', function (data) {
				_this2.state.errors = data.errors;
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'span',
				{ className: 'form__error' },
				this.state.errors
			);
		}
	}]);

	return ErrorMessage;
}(_react.Component);

exports.default = ErrorMessage;

},{"../stores/Store":17,"react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Store = require('../stores/Store');

var _Store2 = _interopRequireDefault(_Store);

var _Users = require('./Users.js');

var _Users2 = _interopRequireDefault(_Users);

var _Canvas = require('./Canvas.js');

var _Canvas2 = _interopRequireDefault(_Canvas);

var _Chat = require('./Chat.js');

var _Chat2 = _interopRequireDefault(_Chat);

var _Puzzle = require('./Puzzle.js');

var _Puzzle2 = _interopRequireDefault(_Puzzle);

var _Endgame = require('./Endgame');

var _Endgame2 = _interopRequireDefault(_Endgame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_Component) {
	_inherits(Home, _Component);

	function Home() {
		_classCallCheck(this, Home);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Home).call(this));

		_this.state = _Store2.default.getState();
		return _this;
	}

	_createClass(Home, [{
		key: 'renderItems',
		value: function renderItems() {
			if (this.state.store.status === 'finished') {
				return _react2.default.createElement(
					'div',
					{ className: 'game__wrap' },
					_react2.default.createElement(_Endgame2.default, null)
				);
			} else {
				return _react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(_Users2.default, { userId: this.props.userId }),
					_react2.default.createElement(
						'div',
						{ className: 'game__wrap' },
						_react2.default.createElement(_Puzzle2.default, null),
						_react2.default.createElement(_Canvas2.default, null),
						_react2.default.createElement(_Chat2.default, null)
					)
				);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'wrapper' },
				this.renderItems()
			);
		}
	}]);

	return Home;
}(_react.Component);

exports.default = Home;

},{"../stores/Store":17,"./Canvas.js":4,"./Chat.js":6,"./Endgame":7,"./Puzzle.js":11,"./Users.js":14,"react":"react"}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = function (_Component) {
	_inherits(Message, _Component);

	function Message(props) {
		_classCallCheck(this, Message);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this, props));
	}

	_createClass(Message, [{
		key: "render",
		value: function render() {
			var chat = this.props.chat;

			return _react2.default.createElement(
				"div",
				{ key: chat.timestamp, className: "chat__msg-wrap" },
				_react2.default.createElement(
					"span",
					{ className: "chat__label" },
					chat.name,
					":"
				),
				_react2.default.createElement(
					"span",
					{ className: "chat__text" },
					chat.message
				)
			);
		}
	}]);

	return Message;
}(_react.Component);

exports.default = Message;

},{"react":"react"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Store = require('../stores/Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Puzzle = function (_Component) {
	_inherits(Puzzle, _Component);

	function Puzzle() {
		_classCallCheck(this, Puzzle);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Puzzle).call(this));

		_this.onChange = _this.onChange.bind(_this);
		_this.state = _Store2.default.getState();
		return _this;
	}

	_createClass(Puzzle, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_Store2.default.listen(this.onChange);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_Store2.default.unlisten(this.onChange);
		}
	}, {
		key: 'onChange',
		value: function onChange(state) {
			this.setState(state);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'game__top' },
				_react2.default.createElement(
					'span',
					{ className: 'game__timer' },
					this.state.store.clock
				),
				_react2.default.createElement(
					'span',
					{ className: 'game__puzzle' },
					this.state.puzzle
				)
			);
		}
	}]);

	return Puzzle;
}(_react.Component);

exports.default = Puzzle;

},{"../stores/Store":17,"react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ErrorMessage = require('./ErrorMessage');

var _ErrorMessage2 = _interopRequireDefault(_ErrorMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoomPicker = function (_Component) {
	_inherits(RoomPicker, _Component);

	function RoomPicker(props) {
		_classCallCheck(this, RoomPicker);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RoomPicker).call(this, props));

		_this.requestJoin = _this.props.requestJoin;
		return _this;
	}

	_createClass(RoomPicker, [{
		key: 'authenticate',
		value: function authenticate(e) {
			e.preventDefault();

			var form = {};
			form.el = e.target;
			form.id = form.el.querySelector('[data-js="room.id"]').value;
			form.password = form.el.querySelector('[data-js="room.password"]').value;
			form.name = form.el.querySelector('[data-js="room.name"]').value;

			this.requestJoin(form.name, form.id, form.password);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'wrapper' },
				_react2.default.createElement(
					'h2',
					{ className: 'alpha' },
					'Join a room'
				),
				_react2.default.createElement(
					'form',
					{ 'data-js': 'room.join', className: 'form', onSubmit: this.authenticate.bind(this) },
					_react2.default.createElement(_ErrorMessage2.default, { socket: this.props.socket }),
					_react2.default.createElement(
						'ul',
						null,
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'label',
								{ className: 'form__control' },
								_react2.default.createElement(
									'span',
									{ className: 'form__label' },
									'Name'
								),
								_react2.default.createElement(
									'span',
									{ className: 'form__input-wrap' },
									_react2.default.createElement('input', { required: true, 'data-js': 'room.name', autoComplete: 'off', type: 'text', className: 'form__input' })
								)
							)
						),
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'label',
								{ className: 'form__control' },
								_react2.default.createElement(
									'span',
									{ className: 'form__label' },
									'Room number'
								),
								_react2.default.createElement(
									'span',
									{ className: 'form__input-wrap' },
									_react2.default.createElement('input', { required: true, 'data-js': 'room.id', autoComplete: 'off', type: 'text', className: 'form__input' })
								)
							)
						),
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'label',
								{ className: 'form__control' },
								_react2.default.createElement(
									'span',
									{ className: 'form__label' },
									'Password'
								),
								_react2.default.createElement(
									'span',
									{ className: 'form__input-wrap' },
									_react2.default.createElement('input', { required: true, 'data-js': 'room.password', type: 'password', className: 'form__input' })
								)
							)
						),
						_react2.default.createElement(
							'li',
							{ className: 'align-right' },
							_react2.default.createElement(
								'button',
								{ className: 'btn--primary' },
								'Submit'
							)
						)
					)
				),
				_react2.default.createElement(
					'h2',
					{ className: 'beta' },
					'Spawn room'
				),
				_react2.default.createElement(
					'form',
					{ 'data-js': 'room.spawn', className: 'form', onSubmit: this.authenticate },
					_react2.default.createElement(
						'ul',
						null,
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'label',
								{ className: 'form__control' },
								_react2.default.createElement(
									'span',
									{ className: 'form__label' },
									'Name'
								),
								_react2.default.createElement(
									'span',
									{ className: 'form__input-wrap' },
									_react2.default.createElement('input', { defaultValue: this.props.username, 'data-js': 'room.username', autoComplete: 'off', type: 'text', className: 'form__input' })
								)
							)
						),
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'label',
								{ className: 'form__control' },
								_react2.default.createElement(
									'span',
									{ className: 'form__label' },
									'Password'
								),
								_react2.default.createElement(
									'span',
									{ className: 'form__input-wrap' },
									_react2.default.createElement('input', { 'data-js': 'room.spawnPassword', type: 'password', className: 'form__input' })
								)
							)
						),
						_react2.default.createElement(
							'li',
							{ className: 'align-right' },
							_react2.default.createElement(
								'button',
								{ className: 'btn--primary' },
								'Spawn'
							)
						)
					)
				)
			);
		}
	}]);

	return RoomPicker;
}(_react.Component);

exports.default = RoomPicker;

},{"./ErrorMessage":8,"react":"react"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Store = require('../stores/Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scoreboard = function (_Component) {
	_inherits(Scoreboard, _Component);

	function Scoreboard(props) {
		_classCallCheck(this, Scoreboard);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Scoreboard).call(this, props));

		_this.onChange = _this.onChange.bind(_this);
		_this.state = _Store2.default.getState();
		return _this;
	}

	_createClass(Scoreboard, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_Store2.default.listen(this.onChange);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_Store2.default.unlisten(this.onChange);
		}
	}, {
		key: 'onChange',
		value: function onChange(state) {
			this.setState(state);
		}
	}, {
		key: 'sortUsers',
		value: function sortUsers() {
			var users = this.state.store.users || {};
			var usersArr = [];

			Object.keys(users).map(function (user, index) {
				usersArr.push(users[user]);
			});

			return usersArr.sort(function (a, b) {
				return a.score - b.score;
			});
		}
	}, {
		key: 'renderUsers',
		value: function renderUsers() {
			var users = this.sortUsers();
			var usersArr = Object.keys(users);

			return usersArr.map(function (item, index) {
				var user = users[item];
				var username = user.name;
				var score = user.score;

				return _react2.default.createElement(
					'li',
					{ key: item },
					_react2.default.createElement(
						'div',
						{ className: 'scoreboard__item' },
						_react2.default.createElement(
							'span',
							{ className: 'scoreboard__item-name' },
							username
						),
						_react2.default.createElement(
							'span',
							{ className: 'scoreboard__item-score' },
							score
						)
					)
				);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'ul',
					{ className: 'scoreboard__items' },
					this.renderUsers()
				)
			);
		}
	}]);

	return Scoreboard;
}(_react.Component);

exports.default = Scoreboard;

},{"../stores/Store":17,"react":"react"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Store = require('../stores/Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Users = function (_Component) {
	_inherits(Users, _Component);

	function Users(props) {
		_classCallCheck(this, Users);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Users).call(this, props));

		_this.onChange = _this.onChange.bind(_this);
		_this.state = _Store2.default.getState();
		return _this;
	}

	_createClass(Users, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			_Store2.default.listen(this.onChange);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			_Store2.default.unlisten(this.onChange);
		}
	}, {
		key: 'onChange',
		value: function onChange(state) {
			this.setState(state);
		}
	}, {
		key: 'getClassName',
		value: function getClassName(user) {
			var status = this.state.store.users[user].status;
			var correct = this.state.store.users[user].correct;

			if (status === 'captain') {
				return 'active';
			}

			if (correct) {
				return 'correct';
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			if (this.state.store.users) {
				var users = Object.keys(this.state.store.users).map(function (user, index) {
					var status = '';
					var classname = 'users__user ' + _this2.getClassName(user);

					return _react2.default.createElement(
						'li',
						{ key: user },
						_react2.default.createElement(
							'span',
							{ className: classname },
							_this2.state.store.users[user].name
						)
					);
				});

				return _react2.default.createElement(
					'ul',
					{ className: 'users__list' },
					users
				);
			}
		}
	}]);

	return Users;
}(_react.Component);

exports.default = Users;

},{"../stores/Store":17,"react":"react"}],15:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _createBrowserHistory = require('history/lib/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var browserHistory = (0, _createBrowserHistory2.default)();

_reactDom2.default.render(_react2.default.createElement(
  _reactRouter.Router,
  { history: browserHistory },
  _routes2.default
), document.getElementById('app'));

},{"./routes":16,"history/lib/createBrowserHistory":26,"react":"react","react-dom":"react-dom","react-router":"react-router"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _App = require('./components/App');

var _App2 = _interopRequireDefault(_App);

var _RoomPicker = require('./components/RoomPicker');

var _RoomPicker2 = _interopRequireDefault(_RoomPicker);

var _GameRoom = require('./components/GameRoom');

var _GameRoom2 = _interopRequireDefault(_GameRoom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createElement(
	_reactRouter.Route,
	{ component: _App2.default },
	_react2.default.createElement(_reactRouter.Route, { path: '/', component: _RoomPicker2.default }),
	_react2.default.createElement(_reactRouter.Route, { path: '/rooms/:roomId', component: _GameRoom2.default })
);

},{"./components/App":3,"./components/GameRoom":9,"./components/RoomPicker":12,"react":"react","react-router":"react-router"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _alt = require('../alt');

var _alt2 = _interopRequireDefault(_alt);

var _Actions = require('../actions/Actions');

var _Actions2 = _interopRequireDefault(_Actions);

var _App = require('../components/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
	function Store() {
		_classCallCheck(this, Store);

		this.store = {};
		this.socket = {};
		this.puzzle = '';

		this.bindListeners({
			handleUpdateStore: _Actions2.default.UPDATE_STORE,
			handleUpdateSocket: _Actions2.default.UPDATE_SOCKET,
			handleUpdateUser: _Actions2.default.UPDATE_USER,
			handleUpdatePuzzle: _Actions2.default.UPDATE_PUZZLE
		});
	}

	_createClass(Store, [{
		key: 'handleUpdateStore',
		value: function handleUpdateStore(data) {
			this.store = data;
		}
	}, {
		key: 'handleUpdateSocket',
		value: function handleUpdateSocket(socket) {
			this.socket = socket;
		}
	}, {
		key: 'handleUpdateUser',
		value: function handleUpdateUser(user) {
			this.user = user;
		}
	}, {
		key: 'handleUpdatePuzzle',
		value: function handleUpdatePuzzle(puzzle) {
			this.puzzle = puzzle;
		}
	}]);

	return Store;
}();

exports.default = _alt2.default.createStore(Store, 'Store');

},{"../actions/Actions":1,"../alt":2,"../components/App":3}],18:[function(require,module,exports){
var pSlice = Array.prototype.slice;
var objectKeys = require('./lib/keys.js');
var isArguments = require('./lib/is_arguments.js');

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}

},{"./lib/is_arguments.js":19,"./lib/keys.js":20}],19:[function(require,module,exports){
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};

},{}],20:[function(require,module,exports){
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],21:[function(require,module,exports){
/**
 * Indicates that navigation was caused by a call to history.push.
 */
'use strict';

exports.__esModule = true;
var PUSH = 'PUSH';

exports.PUSH = PUSH;
/**
 * Indicates that navigation was caused by a call to history.replace.
 */
var REPLACE = 'REPLACE';

exports.REPLACE = REPLACE;
/**
 * Indicates that navigation was caused by some other action such
 * as using a browser's back/forward buttons and/or manually manipulating
 * the URL in a browser's location bar. This is the default.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
 * for more information.
 */
var POP = 'POP';

exports.POP = POP;
exports['default'] = {
  PUSH: PUSH,
  REPLACE: REPLACE,
  POP: POP
};
},{}],22:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.loopAsync = loopAsync;

function loopAsync(turns, work, callback) {
  var currentTurn = 0;
  var isDone = false;

  function done() {
    isDone = true;
    callback.apply(this, arguments);
  }

  function next() {
    if (isDone) return;

    if (currentTurn < turns) {
      work.call(this, currentTurn++, next, done);
    } else {
      done.apply(this, arguments);
    }
  }

  next();
}
},{}],23:[function(require,module,exports){
(function (process){
/*eslint-disable no-empty */
'use strict';

exports.__esModule = true;
exports.saveState = saveState;
exports.readState = readState;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var KeyPrefix = '@@History/';
var QuotaExceededError = 'QuotaExceededError';
var SecurityError = 'SecurityError';

function createKey(key) {
  return KeyPrefix + key;
}

function saveState(key, state) {
  try {
    window.sessionStorage.setItem(createKey(key), JSON.stringify(state));
  } catch (error) {
    if (error.name === SecurityError) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      process.env.NODE_ENV !== 'production' ? _warning2['default'](false, '[history] Unable to save state; sessionStorage is not available due to security settings') : undefined;

      return;
    }

    if (error.name === QuotaExceededError && window.sessionStorage.length === 0) {
      // Safari "private mode" throws QuotaExceededError.
      process.env.NODE_ENV !== 'production' ? _warning2['default'](false, '[history] Unable to save state; sessionStorage is not available in Safari private mode') : undefined;

      return;
    }

    throw error;
  }
}

function readState(key) {
  var json = undefined;
  try {
    json = window.sessionStorage.getItem(createKey(key));
  } catch (error) {
    if (error.name === SecurityError) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      process.env.NODE_ENV !== 'production' ? _warning2['default'](false, '[history] Unable to read state; sessionStorage is not available due to security settings') : undefined;

      return null;
    }
  }

  if (json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      // Ignore invalid JSON.
    }
  }

  return null;
}
}).call(this,require('_process'))

},{"_process":35,"warning":36}],24:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.addEventListener = addEventListener;
exports.removeEventListener = removeEventListener;
exports.getHashPath = getHashPath;
exports.replaceHashPath = replaceHashPath;
exports.getWindowPath = getWindowPath;
exports.go = go;
exports.getUserConfirmation = getUserConfirmation;
exports.supportsHistory = supportsHistory;
exports.supportsGoWithoutReloadUsingHash = supportsGoWithoutReloadUsingHash;

function addEventListener(node, event, listener) {
  if (node.addEventListener) {
    node.addEventListener(event, listener, false);
  } else {
    node.attachEvent('on' + event, listener);
  }
}

function removeEventListener(node, event, listener) {
  if (node.removeEventListener) {
    node.removeEventListener(event, listener, false);
  } else {
    node.detachEvent('on' + event, listener);
  }
}

function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  return window.location.href.split('#')[1] || '';
}

function replaceHashPath(path) {
  window.location.replace(window.location.pathname + window.location.search + '#' + path);
}

function getWindowPath() {
  return window.location.pathname + window.location.search + window.location.hash;
}

function go(n) {
  if (n) window.history.go(n);
}

function getUserConfirmation(message, callback) {
  callback(window.confirm(message));
}

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/rackt/react-router/issues/586
 */

function supportsHistory() {
  var ua = navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return false;
  }
  // FIXME: Work around our browser history not working correctly on Chrome
  // iOS: https://github.com/rackt/react-router/issues/2565
  if (ua.indexOf('CriOS') !== -1) {
    return false;
  }
  return window.history && 'pushState' in window.history;
}

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */

function supportsGoWithoutReloadUsingHash() {
  var ua = navigator.userAgent;
  return ua.indexOf('Firefox') === -1;
}
},{}],25:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
exports.canUseDOM = canUseDOM;
},{}],26:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _Actions = require('./Actions');

var _ExecutionEnvironment = require('./ExecutionEnvironment');

var _DOMUtils = require('./DOMUtils');

var _DOMStateStorage = require('./DOMStateStorage');

var _createDOMHistory = require('./createDOMHistory');

var _createDOMHistory2 = _interopRequireDefault(_createDOMHistory);

var _parsePath = require('./parsePath');

var _parsePath2 = _interopRequireDefault(_parsePath);

/**
 * Creates and returns a history object that uses HTML5's history API
 * (pushState, replaceState, and the popstate event) to manage history.
 * This is the recommended method of managing history in browsers because
 * it provides the cleanest URLs.
 *
 * Note: In browsers that do not support the HTML5 history API full
 * page reloads will be used to preserve URLs.
 */
function createBrowserHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Browser history needs a DOM') : _invariant2['default'](false) : undefined;

  var forceRefresh = options.forceRefresh;

  var isSupported = _DOMUtils.supportsHistory();
  var useRefresh = !isSupported || forceRefresh;

  function getCurrentLocation(historyState) {
    historyState = historyState || window.history.state || {};

    var path = _DOMUtils.getWindowPath();
    var _historyState = historyState;
    var key = _historyState.key;

    var state = undefined;
    if (key) {
      state = _DOMStateStorage.readState(key);
    } else {
      state = null;
      key = history.createKey();

      if (isSupported) window.history.replaceState(_extends({}, historyState, { key: key }), null, path);
    }

    var location = _parsePath2['default'](path);

    return history.createLocation(_extends({}, location, { state: state }), undefined, key);
  }

  function startPopStateListener(_ref) {
    var transitionTo = _ref.transitionTo;

    function popStateListener(event) {
      if (event.state === undefined) return; // Ignore extraneous popstate events in WebKit.

      transitionTo(getCurrentLocation(event.state));
    }

    _DOMUtils.addEventListener(window, 'popstate', popStateListener);

    return function () {
      _DOMUtils.removeEventListener(window, 'popstate', popStateListener);
    };
  }

  function finishTransition(location) {
    var basename = location.basename;
    var pathname = location.pathname;
    var search = location.search;
    var hash = location.hash;
    var state = location.state;
    var action = location.action;
    var key = location.key;

    if (action === _Actions.POP) return; // Nothing to do.

    _DOMStateStorage.saveState(key, state);

    var path = (basename || '') + pathname + search + hash;
    var historyState = {
      key: key
    };

    if (action === _Actions.PUSH) {
      if (useRefresh) {
        window.location.href = path;
        return false; // Prevent location update.
      } else {
          window.history.pushState(historyState, null, path);
        }
    } else {
      // REPLACE
      if (useRefresh) {
        window.location.replace(path);
        return false; // Prevent location update.
      } else {
          window.history.replaceState(historyState, null, path);
        }
    }
  }

  var history = _createDOMHistory2['default'](_extends({}, options, {
    getCurrentLocation: getCurrentLocation,
    finishTransition: finishTransition,
    saveState: _DOMStateStorage.saveState
  }));

  var listenerCount = 0,
      stopPopStateListener = undefined;

  function listenBefore(listener) {
    if (++listenerCount === 1) stopPopStateListener = startPopStateListener(history);

    var unlisten = history.listenBefore(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0) stopPopStateListener();
    };
  }

  function listen(listener) {
    if (++listenerCount === 1) stopPopStateListener = startPopStateListener(history);

    var unlisten = history.listen(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0) stopPopStateListener();
    };
  }

  // deprecated
  function registerTransitionHook(hook) {
    if (++listenerCount === 1) stopPopStateListener = startPopStateListener(history);

    history.registerTransitionHook(hook);
  }

  // deprecated
  function unregisterTransitionHook(hook) {
    history.unregisterTransitionHook(hook);

    if (--listenerCount === 0) stopPopStateListener();
  }

  return _extends({}, history, {
    listenBefore: listenBefore,
    listen: listen,
    registerTransitionHook: registerTransitionHook,
    unregisterTransitionHook: unregisterTransitionHook
  });
}

exports['default'] = createBrowserHistory;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./Actions":21,"./DOMStateStorage":23,"./DOMUtils":24,"./ExecutionEnvironment":25,"./createDOMHistory":27,"./parsePath":32,"_process":35,"invariant":34}],27:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _ExecutionEnvironment = require('./ExecutionEnvironment');

var _DOMUtils = require('./DOMUtils');

var _createHistory = require('./createHistory');

var _createHistory2 = _interopRequireDefault(_createHistory);

function createDOMHistory(options) {
  var history = _createHistory2['default'](_extends({
    getUserConfirmation: _DOMUtils.getUserConfirmation
  }, options, {
    go: _DOMUtils.go
  }));

  function listen(listener) {
    !_ExecutionEnvironment.canUseDOM ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'DOM history needs a DOM') : _invariant2['default'](false) : undefined;

    return history.listen(listener);
  }

  return _extends({}, history, {
    listen: listen
  });
}

exports['default'] = createDOMHistory;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./DOMUtils":24,"./ExecutionEnvironment":25,"./createHistory":28,"_process":35,"invariant":34}],28:[function(require,module,exports){
//import warning from 'warning'
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _AsyncUtils = require('./AsyncUtils');

var _Actions = require('./Actions');

var _createLocation2 = require('./createLocation');

var _createLocation3 = _interopRequireDefault(_createLocation2);

var _runTransitionHook = require('./runTransitionHook');

var _runTransitionHook2 = _interopRequireDefault(_runTransitionHook);

var _parsePath = require('./parsePath');

var _parsePath2 = _interopRequireDefault(_parsePath);

var _deprecate = require('./deprecate');

var _deprecate2 = _interopRequireDefault(_deprecate);

function createRandomKey(length) {
  return Math.random().toString(36).substr(2, length);
}

function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search &&
  //a.action === b.action && // Different action !== location change.
  a.key === b.key && _deepEqual2['default'](a.state, b.state);
}

var DefaultKeyLength = 6;

function createHistory() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var getCurrentLocation = options.getCurrentLocation;
  var finishTransition = options.finishTransition;
  var saveState = options.saveState;
  var go = options.go;
  var keyLength = options.keyLength;
  var getUserConfirmation = options.getUserConfirmation;

  if (typeof keyLength !== 'number') keyLength = DefaultKeyLength;

  var transitionHooks = [];

  function listenBefore(hook) {
    transitionHooks.push(hook);

    return function () {
      transitionHooks = transitionHooks.filter(function (item) {
        return item !== hook;
      });
    };
  }

  var allKeys = [];
  var changeListeners = [];
  var location = undefined;

  function getCurrent() {
    if (pendingLocation && pendingLocation.action === _Actions.POP) {
      return allKeys.indexOf(pendingLocation.key);
    } else if (location) {
      return allKeys.indexOf(location.key);
    } else {
      return -1;
    }
  }

  function updateLocation(newLocation) {
    var current = getCurrent();

    location = newLocation;

    if (location.action === _Actions.PUSH) {
      allKeys = [].concat(allKeys.slice(0, current + 1), [location.key]);
    } else if (location.action === _Actions.REPLACE) {
      allKeys[current] = location.key;
    }

    changeListeners.forEach(function (listener) {
      listener(location);
    });
  }

  function listen(listener) {
    changeListeners.push(listener);

    if (location) {
      listener(location);
    } else {
      var _location = getCurrentLocation();
      allKeys = [_location.key];
      updateLocation(_location);
    }

    return function () {
      changeListeners = changeListeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function confirmTransitionTo(location, callback) {
    _AsyncUtils.loopAsync(transitionHooks.length, function (index, next, done) {
      _runTransitionHook2['default'](transitionHooks[index], location, function (result) {
        if (result != null) {
          done(result);
        } else {
          next();
        }
      });
    }, function (message) {
      if (getUserConfirmation && typeof message === 'string') {
        getUserConfirmation(message, function (ok) {
          callback(ok !== false);
        });
      } else {
        callback(message !== false);
      }
    });
  }

  var pendingLocation = undefined;

  function transitionTo(nextLocation) {
    if (location && locationsAreEqual(location, nextLocation)) return; // Nothing to do.

    pendingLocation = nextLocation;

    confirmTransitionTo(nextLocation, function (ok) {
      if (pendingLocation !== nextLocation) return; // Transition was interrupted.

      if (ok) {
        // treat PUSH to current path like REPLACE to be consistent with browsers
        if (nextLocation.action === _Actions.PUSH) {
          var prevPath = createPath(location);
          var nextPath = createPath(nextLocation);

          if (nextPath === prevPath) nextLocation.action = _Actions.REPLACE;
        }

        if (finishTransition(nextLocation) !== false) updateLocation(nextLocation);
      } else if (location && nextLocation.action === _Actions.POP) {
        var prevIndex = allKeys.indexOf(location.key);
        var nextIndex = allKeys.indexOf(nextLocation.key);

        if (prevIndex !== -1 && nextIndex !== -1) go(prevIndex - nextIndex); // Restore the URL.
      }
    });
  }

  function push(location) {
    transitionTo(createLocation(location, _Actions.PUSH, createKey()));
  }

  function replace(location) {
    transitionTo(createLocation(location, _Actions.REPLACE, createKey()));
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function createKey() {
    return createRandomKey(keyLength);
  }

  function createPath(location) {
    if (location == null || typeof location === 'string') return location;

    var pathname = location.pathname;
    var search = location.search;
    var hash = location.hash;

    var result = pathname;

    if (search) result += search;

    if (hash) result += hash;

    return result;
  }

  function createHref(location) {
    return createPath(location);
  }

  function createLocation(location, action) {
    var key = arguments.length <= 2 || arguments[2] === undefined ? createKey() : arguments[2];

    if (typeof action === 'object') {
      //warning(
      //  false,
      //  'The state (2nd) argument to history.createLocation is deprecated; use a ' +
      //  'location descriptor instead'
      //)

      if (typeof location === 'string') location = _parsePath2['default'](location);

      location = _extends({}, location, { state: action });

      action = key;
      key = arguments[3] || createKey();
    }

    return _createLocation3['default'](location, action, key);
  }

  // deprecated
  function setState(state) {
    if (location) {
      updateLocationState(location, state);
      updateLocation(location);
    } else {
      updateLocationState(getCurrentLocation(), state);
    }
  }

  function updateLocationState(location, state) {
    location.state = _extends({}, location.state, state);
    saveState(location.key, location.state);
  }

  // deprecated
  function registerTransitionHook(hook) {
    if (transitionHooks.indexOf(hook) === -1) transitionHooks.push(hook);
  }

  // deprecated
  function unregisterTransitionHook(hook) {
    transitionHooks = transitionHooks.filter(function (item) {
      return item !== hook;
    });
  }

  // deprecated
  function pushState(state, path) {
    if (typeof path === 'string') path = _parsePath2['default'](path);

    push(_extends({ state: state }, path));
  }

  // deprecated
  function replaceState(state, path) {
    if (typeof path === 'string') path = _parsePath2['default'](path);

    replace(_extends({ state: state }, path));
  }

  return {
    listenBefore: listenBefore,
    listen: listen,
    transitionTo: transitionTo,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    createKey: createKey,
    createPath: createPath,
    createHref: createHref,
    createLocation: createLocation,

    setState: _deprecate2['default'](setState, 'setState is deprecated; use location.key to save state instead'),
    registerTransitionHook: _deprecate2['default'](registerTransitionHook, 'registerTransitionHook is deprecated; use listenBefore instead'),
    unregisterTransitionHook: _deprecate2['default'](unregisterTransitionHook, 'unregisterTransitionHook is deprecated; use the callback returned from listenBefore instead'),
    pushState: _deprecate2['default'](pushState, 'pushState is deprecated; use push instead'),
    replaceState: _deprecate2['default'](replaceState, 'replaceState is deprecated; use replace instead')
  };
}

exports['default'] = createHistory;
module.exports = exports['default'];
},{"./Actions":21,"./AsyncUtils":22,"./createLocation":29,"./deprecate":30,"./parsePath":32,"./runTransitionHook":33,"deep-equal":18}],29:[function(require,module,exports){
//import warning from 'warning'
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Actions = require('./Actions');

var _parsePath = require('./parsePath');

var _parsePath2 = _interopRequireDefault(_parsePath);

function createLocation() {
  var location = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
  var action = arguments.length <= 1 || arguments[1] === undefined ? _Actions.POP : arguments[1];
  var key = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var _fourthArg = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  if (typeof location === 'string') location = _parsePath2['default'](location);

  if (typeof action === 'object') {
    //warning(
    //  false,
    //  'The state (2nd) argument to createLocation is deprecated; use a ' +
    //  'location descriptor instead'
    //)

    location = _extends({}, location, { state: action });

    action = key || _Actions.POP;
    key = _fourthArg;
  }

  var pathname = location.pathname || '/';
  var search = location.search || '';
  var hash = location.hash || '';
  var state = location.state || null;

  return {
    pathname: pathname,
    search: search,
    hash: hash,
    state: state,
    action: action,
    key: key
  };
}

exports['default'] = createLocation;
module.exports = exports['default'];
},{"./Actions":21,"./parsePath":32}],30:[function(require,module,exports){
//import warning from 'warning'

"use strict";

exports.__esModule = true;
function deprecate(fn) {
  return fn;
  //return function () {
  //  warning(false, '[history] ' + message)
  //  return fn.apply(this, arguments)
  //}
}

exports["default"] = deprecate;
module.exports = exports["default"];
},{}],31:[function(require,module,exports){
"use strict";

exports.__esModule = true;
function extractPath(string) {
  var match = string.match(/^https?:\/\/[^\/]*/);

  if (match == null) return string;

  return string.substring(match[0].length);
}

exports["default"] = extractPath;
module.exports = exports["default"];
},{}],32:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _extractPath = require('./extractPath');

var _extractPath2 = _interopRequireDefault(_extractPath);

function parsePath(path) {
  var pathname = _extractPath2['default'](path);
  var search = '';
  var hash = '';

  process.env.NODE_ENV !== 'production' ? _warning2['default'](path === pathname, 'A path must be pathname + search + hash only, not a fully qualified URL like "%s"', path) : undefined;

  var hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substring(hashIndex);
    pathname = pathname.substring(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substring(searchIndex);
    pathname = pathname.substring(0, searchIndex);
  }

  if (pathname === '') pathname = '/';

  return {
    pathname: pathname,
    search: search,
    hash: hash
  };
}

exports['default'] = parsePath;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"./extractPath":31,"_process":35,"warning":36}],33:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function runTransitionHook(hook, location, callback) {
  var result = hook(location, callback);

  if (hook.length < 2) {
    // Assume the hook runs synchronously and automatically
    // call the callback with the return value.
    callback(result);
  } else {
    process.env.NODE_ENV !== 'production' ? _warning2['default'](result === undefined, 'You should not "return" in a transition hook with a callback argument; call the callback instead') : undefined;
  }
}

exports['default'] = runTransitionHook;
module.exports = exports['default'];
}).call(this,require('_process'))

},{"_process":35,"warning":36}],34:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))

},{"_process":35}],35:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],36:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (process.env.NODE_ENV !== 'production') {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))

},{"_process":35}]},{},[15])


//# sourceMappingURL=bundle.js.map
