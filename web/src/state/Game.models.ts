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

export interface Response {
	board: SpaceValue[];
	turn: number;
	winner: SpaceValue;
}

export interface IInitTicTacToe {
	lobby: string;
	letter: SpaceValue;
	grid: SpaceValue[];
}
