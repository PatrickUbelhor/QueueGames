import WebSocket, { Data } from 'ws';
import { Client } from './Client';
import { TicTacToe } from './TicTacToe';

enum RequestMethod {
	SUB = 'SUBSCRIBE',
	MSG = 'MESSAGE'
}

interface Request {
	method: RequestMethod;
	lobby: string;
	body: any;
}

interface ILobby {
	game: TicTacToe;
	clients: Client[];
}

interface ILobbyMap {
	[id: string]: ILobby;
}

const wsserver = new WebSocket.Server({ port: 8080 });
const lobbies: ILobbyMap = {
	'0000': {
		game: new TicTacToe(),
		clients: []
	}
};

function processRequest(ws: WebSocket, request: Request) {
	switch (request.method) {
		case RequestMethod.SUB:
			processSubscription(ws, request);
			break;
		case RequestMethod.MSG:
			processGameAction(request.body);
			break;
		default:
			console.error("Invalid method: %s", request.method);
	}
}

function processSubscription(ws: WebSocket, request: Request) {
	const client = new Client(ws);
	const lobby = lobbies[request.lobby]; // TODO: fail if lobby doesn't exist
	lobby.clients.push(client);
	client.send(lobby.game.getState()); // Send initial game state
}

function processGameAction(request: Request) {
	const lobby = lobbies[request.lobby];
	lobby.game.processAction(request.body);
	const gameState = lobby.game.getState();

	console.log('Sending state to clients');
	lobby.clients.forEach((client: Client) => client.send(gameState));
}

wsserver.on('connection', (ws: WebSocket) => {
	console.log('Client connected');

	ws.on('message', (message: Data) => {
		console.log('Received: %s', message);
		const request: Request = JSON.parse(message as string);

		processRequest(ws, request);
	});
});
