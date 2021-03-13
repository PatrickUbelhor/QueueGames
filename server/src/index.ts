import WebSocket, { Data } from 'ws';

enum SpaceValue {
	NONE = '',
	X = 'X',
	O = 'O'
}

interface State {
	board: SpaceValue[];
	turn: number;
	winner: SpaceValue;
}

const wsserver = new WebSocket.Server({ port: 8080 });

const state: State = {
	board: [
		SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE,
		SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE,
		SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE
	],
	turn: 0,
	winner: SpaceValue.NONE
}

// TODO: only need to search lines that were affected by last move
function detectWinner(): SpaceValue {
	// Top row
	if (state.board[0] !== SpaceValue.NONE && state.board[0] === state.board[1] && state.board[0] === state.board[2]) {
		return state.board[0];
	}
	
	// Middle row
	if (state.board[3] !== SpaceValue.NONE && state.board[3] === state.board[4] && state.board[3] === state.board[5]) {
		return state.board[3];
	}
	
	// Bottom row
	if (state.board[6] !== SpaceValue.NONE && state.board[6] === state.board[7] && state.board[6] === state.board[8]) {
		return state.board[6];
	}
	
	// Left column
	if (state.board[0] !== SpaceValue.NONE && state.board[0] === state.board[3] && state.board[0] === state.board[6]) {
		return state.board[0];
	}
	
	// Middle column
	if (state.board[1] !== SpaceValue.NONE && state.board[1] === state.board[4] && state.board[1] === state.board[7]) {
		return state.board[1];
	}
	
	// Right column
	if (state.board[2] !== SpaceValue.NONE && state.board[2] === state.board[5] && state.board[2] === state.board[8]) {
		return state.board[2];
	}
	
	// Top-left diagonal
	if (state.board[0] !== SpaceValue.NONE && state.board[0] === state.board[4] && state.board[0] === state.board[8]) {
		return state.board[0];
	}
	
	// Top-right diagonal
	if (state.board[2] !== SpaceValue.NONE && state.board[2] === state.board[4] && state.board[2] === state.board[6]) {
		return state.board[2];
	}
	
	return SpaceValue.NONE;
}

const sockets: WebSocket[] = [];
function processTicTacToe(data: any) {
	state.board[data.space] = data.letter;
	state.turn++;
	state.winner = detectWinner();

	sockets.forEach((ws: WebSocket) => {
		console.log('Sending state to websocket');
		ws.send(JSON.stringify(state));
	});
}

enum RequestMethod {
	SUB = 'SUBSCRIBE',
	MSG = 'MESSAGE'
}

interface Request {
	method: RequestMethod;
	lobby: string;
	body: object;
}

interface Lobby {
	members: WebSocket[];
	state: State;
}

interface LobbyMap {
	[key: string]: Lobby
}

const lobbies = {}

wsserver.on('connection', function connection(ws: WebSocket) {
	console.log('Client connected');

	ws.on('message', function incoming(message: Data) {
		console.log('Received: %s', message);
		const request: Request = JSON.parse(message as string);

		switch (request.method) {
			case RequestMethod.SUB:
				// TODO: add ws to lobby
				// TODO: return state?
				sockets.push(ws);
				break;
			case RequestMethod.MSG:
				console.log('Processing message');
				processTicTacToe(request.body);
				break;
			default:
				console.error("Invalid method: %s", request.method);
		}

	});
});
