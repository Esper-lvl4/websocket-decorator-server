const WebSocket = require('ws');
const { SocketDecoratorFactory } = require('./SocketDecorator.js');
const SocketListFactory = require('./SocketList.js');
const SocketRoomsFactory = require('./SocketRooms.js');

function heartbeat() {
	this.isAlive = true;
}

function noop() {}

function initWebsocketServer(options, callback) {
	const props = {
		server: new WebSocket.Server(options, callback),
    socketList: SocketListFactory(),
    socketRooms: SocketRoomsFactory(),
	};
	const prototype = {
		connection(connectCallback) {
			this.server.on('connection', function connectionFunction(websocket) {
				props.server.isAlive = true;
				props.server.on('pong', heartbeat);

				const socket = SocketDecoratorFactory(websocket, { ...props.socketRooms._provideMethods() });
        props.socketList.add(socket);

				socket.on('socket:initialization', function socketInitialization(data) {
					const { id } = data;
					socket.setId(id);
					socket.off('socket:initialization');
				});

				connectCallback(socket, props.socketRooms, props.socketList);
			});

			const interval = setInterval(function ping() {
				props.server.clients.forEach(function each(client) {
					if (client.isAlive === false) return client.terminate();

					client.isAlive = false;
					client.ping(noop);
				});
			}, 30000);

			this.server.on('close', function close() {
				clearInterval(interval);
			});
		},
	};

	const result = Object.create(prototype);
  return Object.assign(result, props);
}

module.exports = {
  SocketDecoratorFactory,
  initWebsocketServer,
};