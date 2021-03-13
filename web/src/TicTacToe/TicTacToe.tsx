import './TicTacToe.css';
import React from 'react';

interface IGameState {
	letter: 'X' | 'O';
	grid: ('' | 'X' | 'O')[];
}

export default class TicTacToe extends React.Component<any, IGameState> {

	constructor(props: any) {
		super(props);

		this.state = {
			letter: 'X',
			grid: ['', '', '', '', '', '', '', '', '']
		}
	}

	onSpaceClick = (id: number) => {
		this.setState((prevState) => {
			const gridCopy = prevState.grid.slice();
			gridCopy[id] = prevState.letter;

			return {
				...prevState,
				letter: prevState.letter === 'X' ? 'O' : 'X',
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
