import { IServerResponse } from './Response';
import WebSocket from 'ws';

export class Client {

	static id: number = 0;

	public ws: WebSocket;
	public id: number;

	constructor(ws: WebSocket) {
		this.ws = ws;
		this.id = Client.id;
		Client.id++;
	}

	public send(data: IServerResponse) {
		this.ws.send(JSON.stringify(data));
	}

}
