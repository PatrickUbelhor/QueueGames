import WebSocket, { Data } from 'ws';

const wsserver = new WebSocket.Server({ port: 8080 });

wsserver.on('connection', function connection(ws: WebSocket) {
	ws.on('message', function incoming(message: Data) {
		console.log('Received: %s', message);
	});

	ws.send('My response');
});
