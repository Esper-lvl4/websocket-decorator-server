const WebSocket = require('ws');
const { SocketDecoratorFactory } = require('./SocketDecorator.js');
const SocketListFactory = require('./SocketList.js');
const SocketRoomsFactory = require('./SocketRooms.js');

function initWebsocketServer(options, callback) {
	const props = {
		server: new WebSocket.Server(options, callback),
    socketList: SocketListFactory(),
    socketRooms: SocketRoomsFactory(),
	};
	const prototype = {
		connection(connectCallback) {
			this.server.on('connection', function connectionFunction(websocket) {
				const socket = SocketDecoratorFactory(websocket, { ...props.socketRooms._provideMethods() });
        props.socketList.add(socket);

				socket.on('socket:initialization', function socketInitialization(data) {
					const { id } = data;
					socket.setId(id);
					socket.off('socket:initialization');
				});

				connectCallback(socket, props.socketRooms, props.socketList);
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