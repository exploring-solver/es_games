/**
 * Quantum Chess - Piece Component
 * Renders chess pieces with quantum visual effects
 */

import React from 'react';
import { Piece as PieceType, Player, PieceType as ChessPieceType } from '../utils/quantumMechanics';

interface PieceProps {
  piece: PieceType;
  probability?: number;
  isGhost?: boolean;
  isSelected?: boolean;
  isEntangled?: boolean;
  onClick?: () => void;
}

const pieceSymbols: Record<ChessPieceType, { white: string; black: string }> = {
  king: { white: '♔', black: '♚' },
  queen: { white: '♕', black: '♛' },
  rook: { white: '♖', black: '♜' },
  bishop: { white: '♗', black: '♝' },
  knight: { white: '♘', black: '♞' },
  pawn: { white: '♙', black: '♟' }
};

export const Piece: React.FC<PieceProps> = ({
  piece,
  probability = 1,
  isGhost = false,
  isSelected = false,
  isEntangled = false,
  onClick
}) => {
  const symbol = pieceSymbols[piece.type][piece.player];

  const baseClasses = [
    'chess-piece',
    piece.player,
    piece.type,
    isGhost ? 'ghost' : 'solid',
    isSelected ? 'selected' : '',
    isEntangled ? 'entangled' : ''
  ].filter(Boolean).join(' ');

  const style: React.CSSProperties = {
    opacity: isGhost ? probability * 0.6 : 1,
    cursor: onClick ? 'pointer' : 'default',
    animation: isGhost ? 'quantum-shimmer 2s infinite' : undefined
  };

  return (
    <div
      className={baseClasses}
      style={style}
      onClick={onClick}
      title={isGhost ? `Probability: ${(probability * 100).toFixed(1)}%` : undefined}
    >
      <span className="piece-symbol">{symbol}</span>
      {isGhost && (
        <div className="probability-indicator">
          <div
            className="probability-bar"
            style={{ width: `${probability * 100}%` }}
          />
        </div>
      )}
      {isEntangled && (
        <div className="entanglement-indicator">⚛</div>
      )}
    </div>
  );
};
