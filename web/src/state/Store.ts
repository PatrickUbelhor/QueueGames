import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { SpaceValue } from './Game.models';
import { IAppState } from './State.models';
import { Action, Actions } from './Actions';

const INITIAL_STATE: IAppState = {
	lobby: null,
	ws: null,
	isConnected: false,
	isSubscribed: false,
	letter: SpaceValue.X,
	grid: [
		SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE,
		SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE,
		SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE
	],
	turn: 0
};

const reducer = function (state: IAppState = INITIAL_STATE, action: Action): IAppState {
	switch (action.type) {
		case Actions.SET_LOBBY:
			return {
				...state,
				lobby: action.payload
			};
		case Actions.SET_WS_SUCCESS:
			return {
				...state,
				ws: action.payload,
				isConnected: true
			};
		case Actions.INIT_GAME:
			return {
				...state,
				lobby: action.payload.lobby,
				letter: action.payload.letter,
				grid: action.payload.board,
				turn: action.payload.turn,
				isSubscribed: true
			};
		case Actions.SET_GAME_STATE:
			return {
				...state,
				grid: action.payload.board,
				turn: action.payload.turn
			};
		default:
			return state;
	}
};

export const store = createStore(reducer, applyMiddleware(thunk));
