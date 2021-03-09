function SocketListFactory() {
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
  };
  const result = Object.create(prototype);
  return Object.assign(result, props);
}

module.exports = SocketListFactory;