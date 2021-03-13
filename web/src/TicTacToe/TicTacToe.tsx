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
			]
		};
	}

	componentDidUpdate() {
		if (this.props.ws) {
			this.props.ws.onmessage = this.onServerMessage;
		}
	}

	onServerMessage = (event) => {
		console.log(event.data);
		const response = JSON.parse(event.data);

		this.setState(() => ({
			grid: response.board as SpaceValue[]
		}));
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

		this.props.ws.send(`{"letter": "${letter}", "space": ${id}}`);
	}

	render() {
		const spaces = this.state.grid.map((letter, index) => (
			<div key={index} className="space-wrapper">
				<div className="space" onClick={() => this.onSpaceClick(index)}>
					<div className="space-content">{letter}</div>
				</div>
			</div>
		));

		return (
			<div className="board-wrapper">
				<div className="board">
					{spaces}
				</div>
			</div>
		);
	}
}
