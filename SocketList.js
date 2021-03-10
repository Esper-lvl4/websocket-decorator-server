function SocketListFactory() {
  let interval;

  const props = {
    sockets: {},
  };
  const prototype = {
    add(socket) {
      if (!socket || this.sockets[socket.id]) return false;
      this.sockets[socket.id] = socket;
      return true;
    },
    remove(id) {
      if (!id || !this.sockets[id]) return false;
      delete (this.sockets[id]);
      return true;
    },
    getById(id) {
      if (!id) return null;
      return this.sockets[id] || null;
    },
    emitToAll(event, data) {
      Object.keys(this.sockets).forEach(key => {
        this.sockets[key].emit(event, data);
      });
    },
    clearDisconnected() {
      Object.keys(this.sockets).forEach((key) => {
        if (!this.sockets[key]) return;
        const { socket } = this.sockets[key];
        if (socket.isAlive === false) {
          this.remove(key);
          return socket.terminate();
        }
        socket.isAlive = false;
        this.sockets[key].emit('ping');
      });
    },
    destroy() {
      clearInterval(interval);
      Object.keys(this.sockets).forEach(key => this.remove(key));
    },
  };
  const result = Object.create(prototype);
  Object.assign(result, props);

  interval = setInterval(result.clearDisconnected, 30000);
  return result;
}

module.exports = SocketListFactory;