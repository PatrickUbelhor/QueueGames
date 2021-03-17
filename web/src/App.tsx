import './App.css';
import React from 'react';
import { connect } from 'react-redux';
import { connectWebsocket, createLobby, joinLobby } from './state/Effects';
import { IAppState } from './state/State.models';
import TicTacToe from './TicTacToe/TicTacToe';

function select(state: IAppState) {
	return {
		isConnected: state.isConnected,
		isSubscribed: state.isSubscribed,
		lobby: state.lobby
	};
}

function mapDispatchToProps(dispatch) {
	return {
		connectToServer: () => dispatch(connectWebsocket()),
		createLobby: () => dispatch(createLobby()),
		joinLobby: (lobbyCode: string) => dispatch(joinLobby(lobbyCode))
	};
}

class ConnectedApp extends React.Component<any, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			lobbyCodeInput: ''
		};
	}

	componentDidMount() {
		this.props.connectToServer();
	}

	onInputChange = (event) => {
		this.setState(() => ({
			lobbyCodeInput: event.target.value
		}));
	}

	onJoinClick = () => {
		// TODO: validate lobby code (make sure all numbers)
		this.props.joinLobby(this.state.lobbyCodeInput);
	}

	render() {
		if (!this.props.isConnected) {
			return <div>Connecting to server...</div>
		}

		if (!this.props.isSubscribed) {
			return (
				<div className="button-wrapper">
					<button className="create-button" onClick={this.props.createLobby}>Create</button>
					<div className="join-wrapper">
						<input className="join-input" value={this.state.lobbyCodeInput} onChange={this.onInputChange}/>
						<button className="join-button" onClick={this.onJoinClick}>Join</button>
					</div>
				</div>
			);
		}

		return (
			<div className="page">
				<div className="lobby-code">Your lobby code is: "{this.props.lobby}"</div>
				<TicTacToe />
			</div>
		);
	}
}

const App = connect(select, mapDispatchToProps)(ConnectedApp);
export default App;
