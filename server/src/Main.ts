import WebSocket, { Data } from 'ws';
import { Client } from './Client';
import { TicTacToe } from './TicTacToe';

enum RequestMethod {
	CREATE = 'CREATE',
	JOIN = 'JOIN',
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

const wsserver = new WebSocket.Server({
	port: 8080,
	path: '/app'
});
const lobbies: ILobbyMap = {};
let nextLobbyId = 0;

function processRequest(ws: WebSocket, request: Request) {
	switch (request.method) {
		case RequestMethod.CREATE:
			createLobby(ws, request);
			break;
		case RequestMethod.JOIN:
			joinLobby(ws, request);
			break;
		case RequestMethod.MSG:
			processGameAction(request);
			break;
		default:
			console.error("Invalid method: %s", request.method);
	}
}

function createLobby(ws: WebSocket, request: Request) {
	const client = new Client(ws);
	const lobbyId = nextLobbyId.toString().padStart(4, '0');
	nextLobbyId++;

	const lobby: ILobby = {
		game: new TicTacToe(),
		clients: [client]
	};

	const initState = lobby.game.addPlayer(client);

	lobbies[lobbyId] = lobby;
	client.send({
		lobby: lobbyId,
		state: initState
	});
}

function joinLobby(ws: WebSocket, request: Request) {
	if (!lobbies.hasOwnProperty(request.lobby)) return;

	const client = new Client(ws);
	const lobby = lobbies[request.lobby]; // TODO: fail if lobby doesn't exist
	const initState = lobby.game.addPlayer(client);

	lobby.clients.push(client);

	client.send({
		lobby: request.lobby,
		state: initState
	});
}

function processGameAction(request: Request) {
	console.log('Action in lobby %s', request.lobby);
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
