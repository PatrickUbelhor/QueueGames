import './TicTacToe.css';
import React from 'react';

enum SpaceValue {
	NONE = '',
	X = 'X',
	O = 'O'
}

interface IGameProps {
	ws: WebSocket
}

interface IGameState {
	letter: SpaceValue;
	grid: SpaceValue[];
	hasSubscribed: boolean;
	ws: WebSocket;
}

enum RequestMethod {
	SUB = 'SUBSCRIBE',
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
			ws: null
		};
	}

	componentDidMount() {
		const ws = new WebSocket('ws://localhost:8080');

		ws.onopen = () => {
			console.log('CONNECTED');
			const request: Request = {
				method: RequestMethod.SUB,
				lobby: '0000'
			}
			ws.send(JSON.stringify(request));

			this.setState((prevState) => ({
				...prevState,
				hasSubscribed: true,
				ws: ws
			}));
		};

		ws.onmessage = (event) => {
			console.log(event.data);
			const response: Response = JSON.parse(event.data);

			this.setState(() => ({
				grid: response.board as SpaceValue[]
			}));
		};

		ws.onerror = (event) => {
			console.error('ERROR');
			console.error(event);
		};
	}

	onSpaceClick = (id: number) => {
		const letter = this.state.letter;
		this.setState((prevState) => {
			const gridCopy = prevState.grid.slice();
			gridCopy[id] = prevState.letter;

			return {
				...prevState,
				letter: prevState.letter === SpaceValue.X ? SpaceValue.O : SpaceValue.X,
				grid: gridCopy
			};
		});

		const request: Request = {
			method: RequestMethod.MSG,
			lobby: '0000',
			body: {
				letter: letter,
				space: id
			}
		};

		this.props.ws.send(JSON.stringify(request));
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
		const content = (
			<div className="board-wrapper">
				<div className="board">
					{spaces}
				</div>
			</div>
		);

		return this.state.hasSubscribed ? content : loadingDiv;
	}
}
