import './TicTacToe.css';
import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../state/State.models';
import { createLobby, joinLobby, performGameAction } from '../state/Effects';

function select(state: IAppState) {
	return {
		letter: state.letter,
		grid: state.grid
	};
}

function mapDispatchToProps(dispatch) {
	return {
		createLobby: () => dispatch(createLobby()),
		joinLobby: (lobbyCode: string) => dispatch(joinLobby(lobbyCode)),
		onSpaceClick: (spaceId: number) => dispatch(performGameAction(spaceId))
	};
}

class ConnectedTicTacToe extends React.Component<any, any> {

	constructor(props) {
		super(props);
	}

	render() {
		const spaces = this.props.grid.map((letter, index) => (
			<div key={index} className="space-wrapper">
				<div className="space" onClick={() => this.props.onSpaceClick(index)}>
					<div className="space-content">{letter}</div>
				</div>
			</div>
		));

		return (
			<div className="ttt-wrapper">
				<div className="board-wrapper">
					<div className="board">
						{spaces}
					</div>
				</div>
			</div>
		);
	}
}

const TicTacToe = connect(select, mapDispatchToProps)(ConnectedTicTacToe);
export default TicTacToe;
