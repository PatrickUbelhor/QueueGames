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

	componentDidMount() {
		const ws = new WebSocket('ws://localhost:8080');
		ws.onopen = this.onOpen;
		ws.onmessage = this.onMessage;
		ws.onerror = this.onError;

		this.setState(() => ({
			ws: ws
		}));
	}

	onOpen = (event) => {
		console.log('CONNECTED');
		console.log(event);
	};

	onMessage = (event) => {
		console.log('MESSAGE');
		console.log(event.data);
	};

	onError = (event) => {
		console.error('ERROR');
		console.error(event);
	};

	render() {
		return (
			<div className="page">
				<TicTacToe ws={this.state.ws} />
			</div>
		);
	}
}

export default App;
