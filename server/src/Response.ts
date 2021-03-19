import { ITicTacToeJoinInfo, ITicTacToeState } from './TicTacToe';

export enum MessageType {
	ERROR = 'ERROR',
	UPDATE = 'UPDATE',
	INIT = 'INIT'
}

export type IServerResponse =
	IServerResponseInit
	| IServerResponseUpdate
	| IServerResponseError
	;

interface IAbstractServerResponse {
	type: MessageType;
}

export interface IServerResponseInit extends IAbstractServerResponse {
	type: MessageType.INIT;
	lobby: string;
	state: ITicTacToeJoinInfo;
}

export interface IServerResponseUpdate extends IAbstractServerResponse {
	type: MessageType.UPDATE;
	lobby: string;
	state: ITicTacToeState;
}

export interface IServerResponseError extends IAbstractServerResponse {
	type: MessageType.ERROR;
	code: number;
}
