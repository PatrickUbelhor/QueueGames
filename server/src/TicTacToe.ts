
export enum SpaceValue {
	NONE = '',
	X = 'X',
	O = 'O'
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
	
	constructor() {
		this.board = [
			SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE,
			SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE,
			SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE
		];
		this.turn = 0;
		this.winner = SpaceValue.NONE;
	}
	
	public processAction = (action: ITicTacToeAction): void => {
		this.board[action.space] = action.letter;
		this.turn++;
		this.winner = this.detectWinner();
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



