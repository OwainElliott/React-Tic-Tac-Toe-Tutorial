import React from 'react';
//Will add changes to make this a 4 by 4 grid
import { useState } from 'react';

function Square({ value, onSquareClick, squareId, winningSquare }) {

    return <button className={"square " + winningSquare} onClick={onSquareClick}>
        {value}
    </button>;
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner[0];
    } else if (squares.includes(null)) {
        status = "Next player: " + (xIsNext ? "X" : "O");
    } else {
        status = "This result is a draw";
    }
    let gameboard = [];
    for (let i = 0; i < 3; i++) {
        let components = []
        for (let j = 3 * i; j < 3 * (i + 1); j++) {
            let highlight = "";
            if (winner && winner.includes(j)) {
                highlight = "winningSquare";
            }
            components.push(<Square value={squares[j]} onSquareClick={() => handleClick(j)} squareId={j} winningSquare={ highlight } />);
        }
        gameboard.push(<div className="board-row"> {components} </div>);
    }

    return (
        
        <div>
            <div className="status">{status}</div>
            { gameboard }
        </div>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentmove] = useState(0);
    const [ascendingMoves, setMoves] = useState(false);
    const xIsNext = (currentMove % 2 === 0);
    const currentSquares = history[currentMove];
    const [toggleMoves, setToggleMoves] = useState("ascending");

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentmove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentmove(nextMove);
    }

    function reorderMoves() {
        setMoves(!ascendingMoves);
        if (ascendingMoves) {
            setToggleMoves("ascending");
        } else {
            setToggleMoves("descending");
        }
    }


    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            let col;
            let row;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    console.log("at " + (j + 3 * i) + " old was " + history[move - 1][3 * i + j] + ", new was " + squares[3 * i + j]);
                    if (squares[3 * i + j] != history[move - 1][3 * i + j]) {
                        console.log("change at " + i + ", " + j)
                        col = j + 1;
                        row = i + 1;
                    }
                }
            }
            
            history[move] 
            description = 'Go to move #' + move + ", which changed (" + col + ", " + row + ")";
        } else {
            description = 'Go to game start';
        }
        let displayMove;
        if (currentMove === move) {
            displayMove = <span>{description}</span>;
        } else {
            displayMove = <button onClick={() => jumpTo(move)}>{description}</button>;
        }
        return (
            <li key={move}>
                {displayMove}
            </li>
        );
    });

    if (ascendingMoves) {
        moves.reverse();
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <button onClick={reorderMoves} >{toggleMoves}</button>
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
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a],a, b, c];
        }
    }
    return null;
}
