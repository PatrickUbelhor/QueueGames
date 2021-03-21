import { SpaceValue } from './Game.models';

export interface IAppState {
	lobby: string;
	ws: WebSocket;
	isConnected: boolean;
	isSubscribed: boolean;
	letter: SpaceValue;
	grid: SpaceValue[];
	turn: number;
}
