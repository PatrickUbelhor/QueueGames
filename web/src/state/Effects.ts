import { Dispatch } from 'react';
import { Action, initGame, setWebsocketSuccess, updateGame } from './Actions';
import { IInitTicTacToe, Request, RequestMethod, Response } from './Game.models';
import { IAppState } from './State.models';

type GetState = () => IAppState;

export const connectWebsocket = () => async (dispatch: Dispatch<Action>, getState: GetState) => {

	const ws = new WebSocket('ws://localhost:8080');
	ws.onopen = () => {
		dispatch(setWebsocketSuccess(ws));
	};

	ws.onmessage = (event) => {
		console.log('MESSAGE');

		// If in a game, process action
		if (!!getState().lobby) {
			const response: Response = JSON.parse(event.data);
			dispatch(updateGame(response.board));

			return;
		}

		// Not in game -> initialize game state
		const response = JSON.parse(event.data);
		const initState: IInitTicTacToe = {
			lobby: response.lobby,
			letter: response.state.player,
			grid: response.state.board
		};
		dispatch(initGame(initState));
	};

	ws.onerror = (event) => {
		console.error('ERROR');
		console.error(event);
	};
};

export const createLobby = () => async (dispatch: Dispatch<Action>, getState: GetState) => {
	const ws = getState().ws;

	const request: Request = {
		method: RequestMethod.CREATE,
		lobby: ''
	};

	ws.send(JSON.stringify(request));
};

export const joinLobby = (lobbyCode: string) => async (dispatch, getState: GetState) => {
	const ws = getState().ws;
	const request: Request = {
		method: RequestMethod.JOIN,
		lobby: lobbyCode
	};

	ws.send(JSON.stringify(request));
}

export const performGameAction = (spaceId: number) => async (dispatch: Dispatch<Action>, getState: GetState) => {
	const gridCopy = getState().grid.slice();
	gridCopy[spaceId] = getState().letter;

	dispatch(updateGame(gridCopy)); // Locally update grid

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
}
