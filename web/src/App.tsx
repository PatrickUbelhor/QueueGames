import './App.css';
import React from 'react';
import TicTacToe from './TicTacToe/TicTacToe';

class App extends React.Component<any, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			ws: null
		};
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
