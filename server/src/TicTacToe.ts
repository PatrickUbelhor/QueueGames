import { Client } from './Client';

export enum SpaceValue {
	NONE = '',
	X = 'X',
	O = 'O'
}

export interface ITicTacToeJoinInfo extends ITicTacToeState {
	player: SpaceValue;
}

export interface ITicTacToeState {
	board: SpaceValue[];
	turn: number;
	winner: SpaceValue;
}

export interface ITicTacToeAction {
	letter: SpaceValue;
	space: number
}

export class TicTacToe {
	
	private readonly board: SpaceValue[];
	private turn: number;
	private winner: SpaceValue;
	private playerX: Client = null;
	private playerO: Client = null;

	constructor() {
		this.board = [
			SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE,
			SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE,
			SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE
		];
		this.turn = 0;
		this.winner = SpaceValue.NONE;
	}

	public addPlayer = (client: Client): ITicTacToeJoinInfo => {
		if (this.playerX == null) {
			this.playerX = client;

			return {
				player: SpaceValue.X,
				...this.getState()
			};
		}

		if (this.playerO == null) {
			this.playerO = client;

			return {
				player: SpaceValue.O,
				...this.getState()
			};
		}

		return {
			player: SpaceValue.NONE,
			...this.getState()
		};
	}
	
	public processAction = (client: Client, action: ITicTacToeAction): [boolean, ITicTacToeState] => {
		// Even turns are for X, odd turns are for O
		if (client.id === this.playerX.id && this.turn % 2 === 0) {
			this.board[action.space] = SpaceValue.X;
			this.turn++;
			this.winner = this.detectWinner();

			return [true, this.getState()];
		}

		if (client.id === this.playerO.id && this.turn % 2 === 1) {
			this.board[action.space] = SpaceValue.O;
			this.turn++;
			this.winner = this.detectWinner();

			return [true, this.getState()];
		}

		return [false, this.getState()];
	}

	public getState = (): ITicTacToeState => {
		return {
			board: this.board,
			turn: this.turn,
			winner: this.winner
		};
	}
	
	// TODO: only need to search lines that were affected by last move
	private detectWinner(): SpaceValue {
		// Top row
		if (this.board[0] !== SpaceValue.NONE && this.board[0] === this.board[1] && this.board[0] === this.board[2]) {
			return this.board[0];
		}
	
		// Middle row
		if (this.board[3] !== SpaceValue.NONE && this.board[3] === this.board[4] && this.board[3] === this.board[5]) {
			return this.board[3];
		}
	
		// Bottom row
		if (this.board[6] !== SpaceValue.NONE && this.board[6] === this.board[7] && this.board[6] === this.board[8]) {
			return this.board[6];
		}
	
		// Left column
		if (this.board[0] !== SpaceValue.NONE && this.board[0] === this.board[3] && this.board[0] === this.board[6]) {
			return this.board[0];
		}
	
		// Middle column
		if (this.board[1] !== SpaceValue.NONE && this.board[1] === this.board[4] && this.board[1] === this.board[7]) {
			return this.board[1];
		}
	
		// Right column
		if (this.board[2] !== SpaceValue.NONE && this.board[2] === this.board[5] && this.board[2] === this.board[8]) {
			return this.board[2];
		}
	
		// Top-left diagonal
		if (this.board[0] !== SpaceValue.NONE && this.board[0] === this.board[4] && this.board[0] === this.board[8]) {
			return this.board[0];
		}
	
		// Top-right diagonal
		if (this.board[2] !== SpaceValue.NONE && this.board[2] === this.board[4] && this.board[2] === this.board[6]) {
			return this.board[2];
		}
	
		return SpaceValue.NONE;
	}
}
