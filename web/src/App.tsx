import './App.css';
import React from 'react';
import TicTacToe from './TicTacToe/TicTacToe';

interface IAppState {
	letter: 'X' | 'O';
	grid: ('' | 'X' | 'O')[];
}

class App extends React.Component<any, IAppState> {

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
		return (
			<div className="page">
				<TicTacToe />
			</div>
		);
	}
}

export default App;
