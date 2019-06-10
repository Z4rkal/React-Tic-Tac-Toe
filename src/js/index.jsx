import React from 'react';
import ReactDOM from 'react-dom';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.winSq? {background: '#ffaaaa'} : {background: 'white'}}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderRow(i) {
    return (
      <div className="board-row">
        {this.renderSquare(3 * i)}
        {this.renderSquare(3 * i + 1)}
        {this.renderSquare(3 * i + 2)}
      </div>
    )
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winSq={(this.props.winLine && (this.props.winLine[1] == i || this.props.winLine[2] == i || this.props.winLine[3] == i))? true : false}
      />
    );
  }

  render() {
    return (
      <div>
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        play: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i] || this.state.stepNumber != this.state.history.length - 1) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        play: [i, this.state.xIsNext ? 'X' : 'O'],
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reset() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
        play: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let cur = false;
      if (this.state.stepNumber == move) cur = true;
      const desc = move ?
        `${step.play[1]} took (${step.play[0] % 3 + 1},${(step.play[0] - (step.play[0] % 3)) / 3 + 1})` :
        'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{cur ? <b>{desc}</b> : desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reset()}>Reset</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],a,b,c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
