export enum SpaceValue {
	NONE = '',
	X = 'X',
	O = 'O'
}

export enum RequestMethod {
	CREATE = 'CREATE',
	JOIN = 'JOIN',
	MSG = 'MESSAGE'
}

export interface TicTacToeAction {
	letter: SpaceValue;
	space: number
}

export interface Request {
	method: RequestMethod;
	lobby: string;
	body?: TicTacToeAction;
}

export interface IInitTicTacToe {
	lobby: string;
	letter: SpaceValue;
	board: SpaceValue[];
	turn: number;
}

export interface ITicTacToeState {
	board: SpaceValue[];
	turn: number;
	winner: SpaceValue;
}

export interface ITicTacToeJoinInfo extends ITicTacToeState {
	player: SpaceValue;
}
