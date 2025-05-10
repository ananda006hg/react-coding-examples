import { useState } from "react";

function Square({ value, onSquareClicked }) {
  return (
    <button className="square" onClick={onSquareClicked}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onplay }) {
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "winner:" + winner;
  } else {
    status = "Next player:" + (xIsNext ? "X" : "O");
  }

  function handleClicked(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onplay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClicked={() => handleClicked(0)} />
        <Square value={squares[1]} onSquareClicked={() => handleClicked(1)} />
        <Square value={squares[2]} onSquareClicked={() => handleClicked(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClicked={() => handleClicked(3)} />
        <Square value={squares[4]} onSquareClicked={() => handleClicked(4)} />
        <Square value={squares[5]} onSquareClicked={() => handleClicked(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClicked={() => handleClicked(6)} />
        <Square value={squares[7]} onSquareClicked={() => handleClicked(7)} />
        <Square value={squares[8]} onSquareClicked={() => handleClicked(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button
          onClick={() => {
            jumTo(move);
          }}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onplay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
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
      return squares[a];
    }
  }
  return null;
}
