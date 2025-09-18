import React, { useState } from "react";
import css from "./TicTacToe.module.css";

const initialBoard = Array(9).fill(null);
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

function checkWinner(board) {
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function getAvailableMoves(board) {
  return board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
}

function computerMove(board) {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return board;
  const move = moves[Math.floor(Math.random() * moves.length)];
  const newBoard = [...board];
  newBoard[move] = "O";
  return newBoard;
}

const TicTacToe = ({ onResult }) => {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const winner = checkWinner(board);
  const isTie = !winner && board.every((cell) => cell !== null);

  React.useEffect(() => {
    if (!isPlayerTurn && !winner && !isTie) {
      setTimeout(() => {
        setBoard((b) => computerMove(b));
        setIsPlayerTurn(true);
      }, 500);
    }
  }, [isPlayerTurn, winner, isTie]);

  React.useEffect(() => {
    if (winner || isTie) {
      if (winner === "X") onResult(2); // Win
      else if (winner === "O") onResult(-2); // Loss
      else if (isTie) onResult(1); // Tie
    }
  }, [winner, isTie, onResult]);

  const handleClick = (i) => {
    if (!isPlayerTurn || board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  return (
    <div className={css.TicTacToeModal}>
      <h2>Tic Tac Toe Break!</h2>
      <div className={css.Board}>
        {board.map((cell, i) => (
          <button key={i} className={css.Cell} onClick={() => handleClick(i)}>
            {cell}
          </button>
        ))}
      </div>
      <div className={css.Status}>
        {winner
          ? winner === "X"
            ? "You win! (+2 points)"
            : "You lose! (-2 points)"
          : isTie
          ? "It's a tie! (+1 point)"
          : isPlayerTurn
          ? "Your turn"
          : "Computer's turn"}
      </div>
    </div>
  );
};

export default TicTacToe;
