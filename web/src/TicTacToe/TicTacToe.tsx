import './TicTacToe.css';
import React from 'react';
import { connect } from 'react-redux';
import { SpaceValue } from '../state/Game.models';
import { IAppState } from '../state/State.models';
import { createLobby, joinLobby, performGameAction } from '../state/Effects';

function select(state: IAppState) {
	return {
		letter: state.letter,
		grid: state.grid,
		turn: state.turn
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

	isMyTurn = () => {
		// TODO: can be made more efficient by putting in component state and updating in componentDidUpdate()
		return (this.props.letter === SpaceValue.X && this.props.turn % 2 === 0)
			|| (this.props.letter === SpaceValue.O && this.props.turn % 2 === 1);
	}

	onSpaceClick = (spaceId: number) => {
		if (this.props.grid[spaceId] !== SpaceValue.NONE) {
			return;
		}

		if (!this.isMyTurn()) {
			return;
		}

		this.props.onSpaceClick(spaceId);
	};

	getSpaceStyle = (spaceId: number) => {
		let style = 'space';

		if (this.isMyTurn() && this.props.grid[spaceId] === SpaceValue.NONE) {
			style += ' space__empty';
		}

		return style;
	};

	render() {
		const spaces = this.props.grid.map((letter, index) => (
			<div key={index} className="space-wrapper">
				<div className={this.getSpaceStyle(index)} onClick={() => this.onSpaceClick(index)}>
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

const TicTacToe = connect(select, mapDispatchToProps)(ConnectedTicTacToe);
export default TicTacToe;
