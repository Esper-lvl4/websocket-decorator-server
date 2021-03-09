const WebSocket = require('ws');
const { SocketDecoratorFactory } = require('./SocketDecorator.js');

function initWebsocketServer(options, callback) {
	const props = {
		server: new WebSocket.Server(options, callback),
	};
	const prototype = {
		connection(callback) {
			this.server.on('connection', function connectionFunction(websocket) {
				const socket = SocketDecoratorFactory(websocket);

				socket.on('socket:initialization', function socketInitialization(data) {
					const { id } = data;
					socket.setId(id);
					socket.off('socket:initialization');
				});
				callback(socket);
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