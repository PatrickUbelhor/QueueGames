import WebSocket, { Data } from 'ws';
import { TicTacToe } from './TicTacToe';

enum RequestMethod {
	SUB = 'SUBSCRIBE',
	MSG = 'MESSAGE'
}

interface Request {
	method: RequestMethod;
	lobby: string;
	body: object;
}

const wsserver = new WebSocket.Server({ port: 8080 });
const clients: WebSocket[] = [];
const game: TicTacToe = new TicTacToe();

function processRequest(ws: WebSocket, request: Request) {
	switch (request.method) {
		case RequestMethod.SUB:
			// TODO: add ws to lobby
			// TODO: return state?
			clients.push(ws);
			break;
		case RequestMethod.MSG:
			processGameAction(request.body);
			break;
		default:
			console.error("Invalid method: %s", request.method);
	}
}

function processGameAction(action: any) {
	game.processAction(action);
	const gameState = game.getState();

	console.log('Sending state to clients');
	clients.forEach((ws: WebSocket) => ws.send(JSON.stringify(gameState)));
}

wsserver.on('connection', (ws: WebSocket) => {
	console.log('Client connected');

	ws.on('message', (message: Data) => {
		console.log('Received: %s', message);
		const request: Request = JSON.parse(message as string);

		processRequest(ws, request);
	});
});
