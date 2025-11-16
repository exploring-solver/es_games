/**
 * Quantum Chess - Board Component
 * Renders the chess board with quantum visualizations
 */

import React, { useMemo } from 'react';
import { Piece as PieceType, Position, positionsEqual } from '../utils/quantumMechanics';
import { Piece } from './Piece';
import { QuantumVisualization } from '../hooks/useQuantumLogic';

interface BoardProps {
  pieces: PieceType[];
  selectedPiece: PieceType | null;
  possibleMoves: Position[];
  visualizations: Map<string, QuantumVisualization[]>;
  onSquareClick: (position: Position) => void;
  onPieceClick: (piece: PieceType) => void;
  quantumIntensity?: (position: Position) => number;
}

export const Board: React.FC<BoardProps> = ({
  pieces,
  selectedPiece,
  possibleMoves,
  visualizations,
  onSquareClick,
  onPieceClick,
  quantumIntensity
}) => {
  const boardSize = 8;

  /**
   * Get all pieces at a position (including superpositions)
   */
  const getPiecesAtPosition = (position: Position): Array<{ piece: PieceType; probability: number; isGhost: boolean }> => {
    const piecesHere: Array<{ piece: PieceType; probability: number; isGhost: boolean }> = [];

    pieces.forEach(piece => {
      const visuals = visualizations.get(piece.id) || [];

      visuals.forEach((visual, index) => {
        if (positionsEqual(visual.position, position)) {
          piecesHere.push({
            piece,
            probability: visual.probability,
            isGhost: visual.isGhost
          });
        }
      });
    });

    // Sort by probability (highest first)
    return piecesHere.sort((a, b) => b.probability - a.probability);
  };

  /**
   * Check if position is a possible move
   */
  const isPossibleMove = (position: Position): boolean => {
    return possibleMoves.some(move => positionsEqual(move, position));
  };

  /**
   * Render a square
   */
  const renderSquare = (row: number, col: number) => {
    const position: Position = { row, col };
    const isLight = (row + col) % 2 === 0;
    const piecesHere = getPiecesAtPosition(position);
    const isSelected = selectedPiece && piecesHere.some(p => p.piece.id === selectedPiece.id);
    const canMoveTo = isPossibleMove(position);
    const intensity = quantumIntensity ? quantumIntensity(position) : 0;

    const squareClasses = [
      'board-square',
      isLight ? 'light' : 'dark',
      isSelected ? 'selected' : '',
      canMoveTo ? 'possible-move' : '',
      intensity > 0.5 ? 'high-quantum' : ''
    ].filter(Boolean).join(' ');

    const squareStyle: React.CSSProperties = {
      '--quantum-intensity': intensity
    } as React.CSSProperties;

    return (
      <div
        key={`${row}-${col}`}
        className={squareClasses}
        style={squareStyle}
        onClick={() => onSquareClick(position)}
      >
        <div className="square-label">
          {row === 7 && (
            <span className="col-label">{String.fromCharCode(97 + col)}</span>
          )}
          {col === 0 && (
            <span className="row-label">{8 - row}</span>
          )}
        </div>

        {intensity > 0.3 && (
          <div className="quantum-field" style={{ opacity: intensity * 0.3 }} />
        )}

        {canMoveTo && (
          <div className="move-indicator">
            {piecesHere.length > 0 ? '⚔' : '•'}
          </div>
        )}

        <div className="pieces-container">
          {piecesHere.map(({ piece, probability, isGhost }, idx) => (
            <Piece
              key={`${piece.id}-${idx}`}
              piece={piece}
              probability={probability}
              isGhost={isGhost}
              isSelected={isSelected && !isGhost}
              isEntangled={piece.isEntangled}
              onClick={() => !isGhost && onPieceClick(piece)}
            />
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render the board
   */
  const renderBoard = useMemo(() => {
    const rows = [];
    for (let row = 0; row < boardSize; row++) {
      const squares = [];
      for (let col = 0; col < boardSize; col++) {
        squares.push(renderSquare(row, col));
      }
      rows.push(
        <div key={row} className="board-row">
          {squares}
        </div>
      );
    }
    return rows;
  }, [pieces, selectedPiece, possibleMoves, visualizations, quantumIntensity]);

  return (
    <div className="chess-board">
      <div className="board-container">
        {renderBoard}
      </div>
      <div className="quantum-overlay" />
    </div>
  );
};
