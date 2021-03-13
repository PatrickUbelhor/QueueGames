import './TicTacToe.css';
import React from 'react';

enum SpaceValue {
	NONE = '',
	X = 'X',
	O = 'O'
}

interface IGameState {
	letter: SpaceValue;
	grid: SpaceValue[];
}

export default class TicTacToe extends React.Component<any, IGameState> {

	constructor(props: any) {
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

	onSpaceClick = (id: number) => {
		this.setState((prevState) => {
			const gridCopy = prevState.grid.slice();
			gridCopy[id] = prevState.letter;

			return {
				...prevState,
				letter: prevState.letter === SpaceValue.X ? SpaceValue.O : SpaceValue.X,
				grid: gridCopy
			};
		});
	}

	render() {
		const spaces = this.state.grid.map((letter, index) => (
			<div className="space-wrapper">
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
