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
