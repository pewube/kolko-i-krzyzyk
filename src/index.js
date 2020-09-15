import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.scss";
import * as serviceWorker from "./serviceWorker";

import Board from "./components/Board";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
      lastClickedIndex: [null],
      sortDescending: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const clickedIndexHistory = this.state.lastClickedIndex.slice(
      0,
      this.state.stepNumber + 1
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      lastClickedIndex: clickedIndexHistory.concat(i),
    });
  }

  showCoordinates(step) {
    let row;
    let column;
    const index = this.state.lastClickedIndex[step];

    if (index < 3) {
      row = 1;
    } else if (index > 2 && index < 6) {
      row = 2;
    } else {
      row = 3;
    }

    if (index === 0 || index === 3 || index === 6) {
      column = "A";
    } else if (index === 1 || index === 4 || index === 7) {
      column = "B";
    } else {
      column = "C";
    }
    return `  (${column + row})`;
  }

  sortList() {
    this.setState({
      sortDescending: !this.state.sortDescending,
    });
  }

  winningSquares = [];

  calculateWinner(squares) {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        this.winningSquares.push(a, b, c);
        return squares[a];
      }
    }
    return null;
  }

  jumpTo(step) {
    this.winningSquares = [];
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move
        ? `Przejdź do ruchu #${move}${this.showCoordinates(move)}`
        : `Przejdź na początek gry`;

      return (
        <li key={move}>
          {this.state.stepNumber === move ? (
            <button
              className="game__info__list-item"
              style={{ fontWeight: "bold" }}
              onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          ) : (
            <button
              className="game__info__list-item"
              onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          )}
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Wygrywa: ${winner}`;
    } else if (this.state.stepNumber === 9) {
      status = `Koniec gry. Brak możliwości kolejnego ruchu.`;
    } else {
      status = `Następny ruch: ${this.state.xIsNext ? "X" : "O"}`;
    }
    return (
      <div className="game">
        <h1 className="game__title">Kółko i krzyżyk</h1>
        <section className="game__panel">
        <div className="game__board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            victory={this.winningSquares}
          />
        </div>
        <h2
            style={
              this.winningSquares.length ? { color: "red" } : { color: "black" }
            }
            className="game__status">
            {status}
          </h2>
        </section>
        <section className="game__info">
          <h3 className="game__info__title">Historia posunięć</h3>
          {this.state.lastClickedIndex.length > 1 ? (
            <>
              <button
                className="game__info__btnSort"
                onClick={this.sortList.bind(this)}>
                {this.state.sortDescending ? `↓↑` : `↓↑`}
              </button>
              <ul className="game__info__list">
                {!this.state.sortDescending ? moves : moves.reverse()}
              </ul>
            </>
          ) : null}
          </section>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
