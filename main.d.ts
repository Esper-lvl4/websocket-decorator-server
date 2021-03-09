import WebSocket from "ws";

export interface SocketDecorator {
  id?: string,
	handlers:globalThis.Map<string, ((data: any) => any)[]>,
	socket: WebSocket,
	on: (event: string, handler: (data: any) => any) => any,
  off: (event: string, handler?: (data: any) => any) => void,
	emit: (event: string, data: any) => void,
	getHandlers: (event: string) => ((data: any) => any)[],
	setId: (id: string) => void,
}
export interface SocketServer {
	server: WebSocket.Server,
	connection: (callback: (socket: SocketDecorator) => void) => void,
}
export function initWebsocketServer(url: string, protocols?: string | string[]): SocketDecorator;
export function SocketDecoratorFactory(): SocketDecorator;