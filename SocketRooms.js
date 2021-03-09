function SocketRoomsFactory() {
  const props = {
    rooms: {},
  };
  const prototype = {
    joinRoom(name, socket) {
      if (!name || !socket) return false;
      if (!this.rooms[name]) {
        this.rooms[name] = [];
      }
      const alreadyJoined = this.rooms[name]
        .find(joinedSocket => joinedSocket.id === socket.id);
      if (alreadyJoined) return false;
      this.rooms[name].push(socket);
      return true;
    },
    leaveRoom(name, socket) {
      if (!name || !socket || !this.rooms[name]) return false;
      const index = this.rooms[name]
        .findIndex(joinedSocket => joinedSocket.id === socket.id);
      if (index === -1) return false;
      this.rooms[name].splice(index, 1);
      return true;
    },
    emitToRoom({ name, event, data, excludedId }) {
      if (!name || !this.rooms[name] || !event) return false;
      this.rooms[name].forEach(joinedSocket => {
        if (joinedSocket.id === excludedId) return;
        joinedSocket.emit(event, data);
      });
      return true;
    },
  };
  const result = Object.create(prototype);
  return Object.assign(result, props);
}

module.exports = SocketRoomsFactory;