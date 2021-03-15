import './TicTacToe.css';
import React from 'react';

enum SpaceValue {
	NONE = '',
	X = 'X',
	O = 'O'
}

interface IGameProps {
	// ws: WebSocket
}

interface IGameState {
	letter: SpaceValue;
	grid: SpaceValue[];
	hasSubscribed: boolean;
	lobby: string;
	ws: WebSocket;
	codeInput: string;
}

enum RequestMethod {
	CREATE = 'CREATE',
	JOIN = 'JOIN',
	MSG = 'MESSAGE'
}

interface TicTacToeAction {
	letter: SpaceValue;
	space: number
}

interface Request {
	method: RequestMethod;
	lobby: string;
	body?: TicTacToeAction;
}

interface Response {
	board: SpaceValue[];
	turn: number;
	winner: SpaceValue;
}

export default class TicTacToe extends React.Component<IGameProps, IGameState> {

	constructor(props) {
		super(props);

		this.state = {
			letter: SpaceValue.X,
			grid: [
				SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE,
				SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE,
				SpaceValue.NONE, SpaceValue.NONE, SpaceValue.NONE
			],
			hasSubscribed: false,
			lobby: null,
			ws: null,
			codeInput: ''
		};
	}

	componentDidMount() {
		const ws = new WebSocket('ws://localhost:8080');

		ws.onopen = () => {
			console.log('CONNECTED');
			this.setState(() => ({
				ws: ws
			}));
		};

		ws.onmessage = (event) => {
			console.log('MESSAGE');

			// Process game action
			if (this.state.hasSubscribed) {
				const response: Response = JSON.parse(event.data);

				this.setState(() => ({
					grid: response.board as SpaceValue[]
				}));

				return;
			}

			// Initialize game state
			const response = JSON.parse(event.data);
			this.setState(() => ({
				lobby: response.lobby,
				hasSubscribed: true,
				letter: response.state.player,
				grid: response.state.board,
			}));
		};

		ws.onerror = (event) => {
			console.error('ERROR');
			console.error(event);
		};
	}

	onCreateClick = () => {
		const request: Request = {
			method: RequestMethod.CREATE,
			lobby: ''
		};

		this.state.ws.send(JSON.stringify(request));
	}

	onJoinClick = () => {
		const request: Request = {
			method: RequestMethod.JOIN,
			lobby: this.state.codeInput
		};

		this.state.ws.send(JSON.stringify(request));
	}

	onSpaceClick = (id: number) => {
		const letter = this.state.letter;
		this.setState((prevState) => {
			const gridCopy = prevState.grid.slice();
			gridCopy[id] = prevState.letter;

			return {
				...prevState,
				grid: gridCopy
			};
		});

		const request: Request = {
			method: RequestMethod.MSG,
			lobby: this.state.lobby,
			body: {
				letter: letter,
				space: id
			}
		};

		this.state.ws.send(JSON.stringify(request));
	}

	onInputChange = (event) => {
		this.setState(() => ({
			codeInput: event.target.value
		}));
	}

	render() {
		const spaces = this.state.grid.map((letter, index) => (
			<div key={index} className="space-wrapper">
				<div className="space" onClick={() => this.onSpaceClick(index)}>
					<div className="space-content">{letter}</div>
				</div>
			</div>
		));

		const loadingDiv = <div>Loading...</div>;
		const buttons = (
			<div className="ttt-wrapper">
				<button className="create-button" onClick={this.onCreateClick}>Create</button>
				<div className="join-wrapper">
					<input className="join-input" value={this.state.codeInput} onChange={this.onInputChange}/>
					<button className="join-button" onClick={this.onJoinClick}>Join</button>
				</div>
			</div>
		);
		const content = (
			<div className="ttt-wrapper">
				<div className="lobby-code">Your lobby code is: "{this.state.lobby}"</div>
				<div className="board-wrapper">
					<div className="board">
						{spaces}
					</div>
				</div>
			</div>
		);

		if (this.state.ws == null) {
			return loadingDiv;
		}

		if (this.state.hasSubscribed) {
			return content;
		}

		return buttons;
	}
}
