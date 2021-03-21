import { IInitTicTacToe, ITicTacToeState } from './Game.models';

export interface Action {
	type: Actions;
	payload?: any;
}

export enum Actions {
	SET_WS_SUCCESS = '[WS] Websocket connection successful',
	SET_LOBBY = '[LOBBY] Set lobby',
	SET_GAME_STATE = '[GAME] Set game state',
	INIT_GAME = '[GAME] Init game state'
}

export const setWebsocketSuccess = (ws: WebSocket): Action => ({
	type: Actions.SET_WS_SUCCESS,
	payload: ws
});

export const setLobby = (lobbyCode: string): Action => ({
	type: Actions.SET_LOBBY,
	payload: lobbyCode
});

export const initGame = (data: IInitTicTacToe): Action => ({
	type: Actions.INIT_GAME,
	payload: data
});

export const updateGame = (data: ITicTacToeState): Action => ({
	type: Actions.SET_GAME_STATE,
	payload: data
});
