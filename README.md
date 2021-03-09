# websocket-decorator-server
Wrapper around ws package. Just to simplify the usage.

## Usage
```
import { initWebsocketServer } from "./SocketLibrary";

const server = initWebsocketServer({ port: 5000 });

server.connection(function connection(socket) {
	socket.on('test-message', function testMessage(data) {
		console.log(data);
	});

	socket.emit('test', 'Where interesting message!');
});
```
Package is paired with websocket-decorator on client side.
