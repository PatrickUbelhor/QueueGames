import { Dispatch } from 'react';
import { Action, initGame, setWebsocketSuccess, updateGame } from './Actions';
import { IInitTicTacToe, ITicTacToeState, Request, RequestMethod, SpaceValue } from './Game.models';
import { IServerResponse, IServerResponseError, IServerResponseInit, IServerResponseUpdate, MessageType } from './Response.models';
import { IAppState } from './State.models';

type GetState = () => IAppState;

export const connectWebsocket = () => async (dispatch: Dispatch<Action>, getState: GetState) => {
	const ws = new WebSocket('wss://games.patrickubelhor.com:443/app');
	ws.onopen = () => {
		dispatch(setWebsocketSuccess(ws));
	};

	ws.onmessage = (event) => {
		console.log('MESSAGE');

		const response: IServerResponse = JSON.parse(event.data);
		switch (response.type) {
			case MessageType.INIT:
				handleGameInitResponse(response, dispatch);
				break;
			case MessageType.UPDATE:
				handleGameUpdateResponse(response, dispatch);
				break;
			case MessageType.ERROR:
				handleGameErrorResponse(response, dispatch);
				break;
			default:
				console.error("Received request I don't understand");
		}
	};

	ws.onerror = (event) => {
		console.error('ERROR');
		console.error(event);
	};
};

function handleGameInitResponse(response: IServerResponseInit, dispatch: Dispatch<Action>) {
	const initialState: IInitTicTacToe = {
		lobby: response.lobby,
		letter: response.state.player,
		grid: response.state.board
	};
	dispatch(initGame(initialState));
}

function handleGameUpdateResponse(response: IServerResponseUpdate, dispatch: Dispatch<Action>) {
	dispatch(updateGame(response.state));
}

function handleGameErrorResponse(response: IServerResponseError, dispatch: Dispatch<Action>) {
	dispatch(updateGame(response.state));
	console.error('Error %d', response.code);
}


export const createLobby = () => async (dispatch: Dispatch<Action>, getState: GetState) => {
	const ws = getState().ws;

	const request: Request = {
		method: RequestMethod.CREATE,
		lobby: ''
	};

	ws.send(JSON.stringify(request));
};


export const joinLobby = (lobbyCode: string) => async (dispatch: Dispatch<Action>, getState: GetState) => {
	const ws = getState().ws;
	const request: Request = {
		method: RequestMethod.JOIN,
		lobby: lobbyCode
	};

	ws.send(JSON.stringify(request));
};


export const performGameAction = (spaceId: number) => async (dispatch: Dispatch<Action>, getState: GetState) => {
	const gridCopy = getState().grid.slice();
	gridCopy[spaceId] = getState().letter;

	// Locally update grid
	const nextState: ITicTacToeState = {
		board: gridCopy,
		turn: getState().turn + 1,
		winner: SpaceValue.NONE
	};
	dispatch(updateGame(nextState));

	// Remotely update grid
	const request: Request = {
		method: RequestMethod.MSG,
		lobby: getState().lobby,
		body: {
			letter: getState().letter,
			space: spaceId
		}
	};

	getState().ws.send(JSON.stringify(request));
};
