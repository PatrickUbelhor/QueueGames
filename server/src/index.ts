import WebSocket, { Data } from 'ws';

const wsserver = new WebSocket.Server({ port: 8080 });

const game = [
	'', '', '',
	'', '', '',
	'', '', ''
];

wsserver.on('connection', function connection(ws: WebSocket) {
	ws.on('message', function incoming(message: Data) {
		console.log('Received: %s', message);
		const data = JSON.parse(message as string);
		game[data.space] = data.letter;

		const response = {
			board: game
		};

		ws.send(JSON.stringify(response));
	});

	ws.send('My response');
});
