import WebSocket from "ws";

export interface SocketList {
  sockets: { [key: string]: SocketDecorator },
  add: (id: string) => boolean,
  remove: (id: string) => boolean,
  getById: (id: string) => SocketDecorator | null,
  emitToAll: (event: string, data: any) => void,
}
export interface SocketRooms {
  rooms: { [key: string]: SocketDecorator[]},
  joinRoom: (name: string, socket: SocketDecorator) => boolean,
  leaveRoom: (name: string, socket: SocketDecorator) => boolean,
  emitToRoom: (options: {
    name: string,
    event: string,
    data: any,
    excludedId?: string,
  }) => boolean,
}
export interface SocketDecorator {
  id?: string,
	handlers:globalThis.Map<string, ((data: any) => any)[]>,
	socket: WebSocket,
  _socketRooms: SocketRooms,
	on: (event: string, handler: (data: any) => any) => any,
  off: (event: string, handler?: (data: any) => any) => void,
	emit: (event: string, data: any) => void,
	getHandlers: (event: string) => ((data: any) => any)[],
	setId: (id: string) => void,
  joinRoom: (name: string) => boolean,
  leaveRoom: (name: string) => boolean,
  emitToRoom: (options: {
    name: string,
    event: string,
    data: any,
  }) => boolean,
}
export interface SocketServer {
	server: WebSocket.Server,
  socketList: SocketList,
  socketRooms: SocketRooms,
	connection: (callback: (
    socket: SocketDecorator,
  ) => void) => void,
  connection: (callback: (
    socket: SocketDecorator,
    socketRooms: SocketRooms,
  ) => void) => void,
  connection: (callback: (
    socket: SocketDecorator,
    socketRooms: SocketRooms,
    socketList: SocketList,
  ) => void) => void,
}

export function initWebsocketServer(options?: WebSocket.ServerOptions, callback?: () => void,): SocketServer;
export function SocketDecoratorFactory(): SocketDecorator;