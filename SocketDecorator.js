function SocketDecoratorFactory(socket, {
  joinRoom, leaveRoom, emitToRoom,
}) {
	const props = {
		id: undefined,
		handlers: new Map(),
		socket,
	};

	const prototype = {
		on(event, handler) {
      if (!handler) return;
			if (!Array.isArray(this.handlers.get(event))) {
				this.handlers.set(event, []);
			}
			this.getHandlers(event).push(handler);
		},
		emit(event, data) {
			const info = { event, data };
			this.socket.send(JSON.stringify(info));
		},
		off(event, handler) {
			if (!handler) {
				this.handlers.set(event, []);
				return;
			}

			const handlers = this.getHandlers(event);
			const index = handlers.findIndex(func => func === handler);
			if (index === -1) return;
			handlers.splice(index, 1);
		},
		getHandlers(event) {
			const handlers = this.handlers.get(event);
			if (!Array.isArray(handlers)) return [];
			return handlers;
		},
		setId(id) {
			if (!id) return;
			this.id = id;
		},
    joinRoom(name) {
      return joinRoom(name, this);
    },
    leaveRoom(name) {
      return leaveRoom(name, this);
    },
    emitToRoom({name, event, data}) {
      return emitToRoom({ name, event, data, excludedId: this.id });
    },
		confirmLife() {
			this.socket.isAlive = true;
		},
	};

	const result = Object.create(prototype);
	Object.assign(result, props);

	result.socket.on('message', function incoming(info) {
		let parsedInfo;
		try {
			parsedInfo = JSON.parse(info);
		} catch (err) {
			console.error(err);
			parsedInfo = null;
		}
		if (!parsedInfo) return;
		const { event, data } = parsedInfo;
		const handlers = result.getHandlers(event);
		if (handlers.length === 0) return;
		handlers.forEach(handler => handler(data));
	});

	result.on('pong', function heartbeat() {
		result.confirmLife();
	});

	result.on('ping', function clientIsAlive() {
		result.confirmLife();
	});

	result.confirmLife();

	return result;
}

module.exports = {
  SocketDecoratorFactory,
}