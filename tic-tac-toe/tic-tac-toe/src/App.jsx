import { useState } from "react";

function Square({ value, onSquareClicked, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? "winning-square" : ""}`}
      onClick={onSquareClicked}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onplay, winningLine }) {
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((square) => square !== null)) {
    status = "Draw! No one wins.";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
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

    onplay(nextSquares, i);
  }

  // Create board using two loops instead of hardcoding
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      squaresInRow.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClicked={() => handleClicked(squareIndex)}
          isWinningSquare={winningLine && winningLine.includes(squareIndex)}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const [moveLocations, setMoveLocations] = useState([]);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Get winning line (if any)
  const winInfo = calculateWinnerWithLine(currentSquares);
  const winningLine = winInfo ? winInfo.line : null;

  function handlePlay(nextSquares, squareIndex) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // Calculate and store the move location (row, col)
    const row = Math.floor(squareIndex / 3) + 1;
    const col = (squareIndex % 3) + 1;
    const nextMoveLocations = [
      ...moveLocations.slice(0, currentMove),
      { row, col },
    ];
    setMoveLocations(nextMoveLocations);
  }

  function jumTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleMoveOrder() {
    setIsAscending(!isAscending);
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const location = moveLocations[move - 1];
      const locationText = location
        ? ` (${location.row}, ${location.col})`
        : "";
      description = "Go to move #" + move + locationText;
    } else {
      description = "Go to game start";
    }

    // For current move, show text instead of button
    if (move === currentMove) {
      return (
        <li key={move}>
          <span>You are at move #{move}</span>
        </li>
      );
    }

    return (
      <li key={move}>
        <button onClick={() => jumTo(move)}>{description}</button>
      </li>
    );
  });

  // If not ascending, reverse the moves order
  if (!isAscending) {
    moves = moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onplay={handlePlay}
          winningLine={winningLine}
        />
      </div>
      <div className="game-info">
        <div>
          <button onClick={toggleMoveOrder}>
            {isAscending ? "Sort Descending" : "Sort Ascending"}
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const result = calculateWinnerWithLine(squares);
  return result ? result.winner : null;
}

function calculateWinnerWithLine(squares) {
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
      return {
        winner: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}
