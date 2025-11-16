/**
 * Quantum Chess - Quantum Mechanics Utilities
 * Handles superposition, entanglement, measurement, and quantum events
 */

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type Player = 'white' | 'black';

export interface Position {
  row: number;
  col: number;
}

export interface QuantumState {
  position: Position;
  probability: number;
}

export interface Piece {
  id: string;
  type: PieceType;
  player: Player;
  quantumStates: QuantumState[];
  isEntangled: boolean;
  entangledWith?: string[];
  hasMoved: boolean;
}

export interface QuantumEvent {
  type: 'tunneling' | 'interference' | 'decoherence';
  description: string;
  affectedPieces: string[];
  probability: number;
}

export interface GameState {
  pieces: Piece[];
  currentPlayer: Player;
  moveCount: number;
  lastMove?: {
    pieceId: string;
    from: Position;
    to: Position;
  };
  quantumEvents: QuantumEvent[];
  decoherenceLevel: number;
}

/**
 * Calculate probability amplitude for a quantum state
 */
export function calculateAmplitude(probability: number): number {
  return Math.sqrt(probability);
}

/**
 * Normalize quantum state probabilities to sum to 1
 */
export function normalizeQuantumStates(states: QuantumState[]): QuantumState[] {
  const total = states.reduce((sum, state) => sum + state.probability, 0);
  if (total === 0) return states;

  return states.map(state => ({
    ...state,
    probability: state.probability / total
  }));
}

/**
 * Create a piece in superposition at multiple positions
 */
export function createSuperposition(
  piece: Piece,
  positions: Position[],
  probabilities?: number[]
): Piece {
  const defaultProb = 1 / positions.length;
  const quantumStates = positions.map((pos, idx) => ({
    position: pos,
    probability: probabilities?.[idx] || defaultProb
  }));

  return {
    ...piece,
    quantumStates: normalizeQuantumStates(quantumStates)
  };
}

/**
 * Measure/collapse a quantum state to a single position
 */
export function collapseQuantumState(piece: Piece): Piece {
  if (piece.quantumStates.length <= 1) return piece;

  const random = Math.random();
  let cumulative = 0;

  for (const state of piece.quantumStates) {
    cumulative += state.probability;
    if (random <= cumulative) {
      return {
        ...piece,
        quantumStates: [{
          position: state.position,
          probability: 1.0
        }]
      };
    }
  }

  // Fallback to highest probability state
  const maxState = piece.quantumStates.reduce((max, state) =>
    state.probability > max.probability ? state : max
  );

  return {
    ...piece,
    quantumStates: [{ ...maxState, probability: 1.0 }]
  };
}

/**
 * Check if two positions are the same
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Calculate distance between two positions
 */
export function calculateDistance(pos1: Position, pos2: Position): number {
  return Math.sqrt(
    Math.pow(pos1.row - pos2.row, 2) + Math.pow(pos1.col - pos2.col, 2)
  );
}

/**
 * Create quantum entanglement between pieces
 */
export function entanglePieces(piece1: Piece, piece2: Piece): [Piece, Piece] {
  const entangledPiece1: Piece = {
    ...piece1,
    isEntangled: true,
    entangledWith: [...(piece1.entangledWith || []), piece2.id]
  };

  const entangledPiece2: Piece = {
    ...piece2,
    isEntangled: true,
    entangledWith: [...(piece2.entangledWith || []), piece1.id]
  };

  return [entangledPiece1, entangledPiece2];
}

/**
 * Break entanglement between pieces
 */
export function breakEntanglement(piece: Piece, targetId?: string): Piece {
  if (!piece.isEntangled) return piece;

  const entangledWith = targetId
    ? piece.entangledWith?.filter(id => id !== targetId) || []
    : [];

  return {
    ...piece,
    isEntangled: entangledWith.length > 0,
    entangledWith: entangledWith.length > 0 ? entangledWith : undefined
  };
}

/**
 * Apply quantum interference between overlapping superposition states
 */
export function applyInterference(pieces: Piece[]): Piece[] {
  const positionMap = new Map<string, { pieces: Piece[]; indices: number[] }>();

  // Group pieces by position
  pieces.forEach((piece, idx) => {
    piece.quantumStates.forEach(state => {
      const key = `${state.position.row},${state.position.col}`;
      const existing = positionMap.get(key) || { pieces: [], indices: [] };
      existing.pieces.push(piece);
      existing.indices.push(idx);
      positionMap.set(key, existing);
    });
  });

  // Apply interference effects
  const modifiedPieces = [...pieces];
  positionMap.forEach(({ pieces: overlappingPieces, indices }) => {
    if (overlappingPieces.length > 1) {
      // Reduce probabilities due to interference
      indices.forEach(idx => {
        const piece = modifiedPieces[idx];
        modifiedPieces[idx] = {
          ...piece,
          quantumStates: piece.quantumStates.map(state => ({
            ...state,
            probability: state.probability * 0.85 // Interference reduction
          }))
        };
      });
    }
  });

  return modifiedPieces.map(piece => ({
    ...piece,
    quantumStates: normalizeQuantumStates(piece.quantumStates)
  }));
}

/**
 * Apply quantum tunneling - piece has small probability to move through barriers
 */
export function applyTunneling(piece: Piece, targetPosition: Position): Piece {
  const tunnelingProbability = 0.15;

  // Check if piece is in superposition
  if (piece.quantumStates.length === 1) {
    // Create superposition with tunneling
    return {
      ...piece,
      quantumStates: normalizeQuantumStates([
        { ...piece.quantumStates[0], probability: 1 - tunnelingProbability },
        { position: targetPosition, probability: tunnelingProbability }
      ])
    };
  }

  // Add tunneling state to existing superposition
  const newStates = [
    ...piece.quantumStates.map(s => ({ ...s, probability: s.probability * (1 - tunnelingProbability) })),
    { position: targetPosition, probability: tunnelingProbability }
  ];

  return {
    ...piece,
    quantumStates: normalizeQuantumStates(newStates)
  };
}

/**
 * Apply decoherence - quantum states decay over time
 */
export function applyDecoherence(piece: Piece, decoherenceRate: number = 0.05): Piece {
  if (piece.quantumStates.length <= 1) return piece;

  // Increase probability of most likely state, decrease others
  const maxState = piece.quantumStates.reduce((max, state) =>
    state.probability > max.probability ? state : max
  );

  const newStates = piece.quantumStates.map(state => {
    if (positionsEqual(state.position, maxState.position)) {
      return { ...state, probability: state.probability + decoherenceRate };
    } else {
      return { ...state, probability: Math.max(0, state.probability - decoherenceRate / (piece.quantumStates.length - 1)) };
    }
  });

  // Remove states with very low probability
  const filteredStates = newStates.filter(s => s.probability > 0.05);

  return {
    ...piece,
    quantumStates: normalizeQuantumStates(filteredStates.length > 0 ? filteredStates : newStates)
  };
}

/**
 * Generate random quantum event
 */
export function generateQuantumEvent(pieces: Piece[]): QuantumEvent | null {
  const eventProbability = 0.12;
  if (Math.random() > eventProbability) return null;

  const eventTypes: QuantumEvent['type'][] = ['tunneling', 'interference', 'decoherence'];
  const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

  // Select random pieces to affect
  const numAffected = Math.min(1 + Math.floor(Math.random() * 3), pieces.length);
  const affectedPieces = pieces
    .sort(() => Math.random() - 0.5)
    .slice(0, numAffected)
    .map(p => p.id);

  const descriptions = {
    tunneling: 'Quantum tunneling detected! Pieces can phase through barriers.',
    interference: 'Wave interference occurring! Superposition probabilities shifting.',
    decoherence: 'Quantum decoherence! States are collapsing towards classical positions.'
  };

  return {
    type,
    description: descriptions[type],
    affectedPieces,
    probability: 0.5 + Math.random() * 0.5
  };
}

/**
 * Get all possible classical chess moves for a piece
 */
export function getPossibleMoves(piece: Piece, allPieces: Piece[], boardSize: number = 8): Position[] {
  const moves: Position[] = [];

  // Use the most probable position for move calculation
  const currentPos = piece.quantumStates.reduce((max, state) =>
    state.probability > max.probability ? state : max
  ).position;

  switch (piece.type) {
    case 'pawn':
      const direction = piece.player === 'white' ? -1 : 1;
      const forwardOne = { row: currentPos.row + direction, col: currentPos.col };

      // Move forward
      if (!isPieceAt(forwardOne, allPieces)) {
        moves.push(forwardOne);

        // Double move from start
        if (!piece.hasMoved) {
          const forwardTwo = { row: currentPos.row + 2 * direction, col: currentPos.col };
          if (!isPieceAt(forwardTwo, allPieces)) {
            moves.push(forwardTwo);
          }
        }
      }

      // Captures
      [-1, 1].forEach(colOffset => {
        const capturePos = { row: currentPos.row + direction, col: currentPos.col + colOffset };
        if (isPieceAt(capturePos, allPieces, piece.player === 'white' ? 'black' : 'white')) {
          moves.push(capturePos);
        }
      });
      break;

    case 'rook':
      addLineMoves(currentPos, [[1, 0], [-1, 0], [0, 1], [0, -1]], allPieces, piece.player, moves, boardSize);
      break;

    case 'bishop':
      addLineMoves(currentPos, [[1, 1], [1, -1], [-1, 1], [-1, -1]], allPieces, piece.player, moves, boardSize);
      break;

    case 'queen':
      addLineMoves(currentPos, [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ], allPieces, piece.player, moves, boardSize);
      break;

    case 'knight':
      [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
      ].forEach(([rowOffset, colOffset]) => {
        const pos = { row: currentPos.row + rowOffset, col: currentPos.col + colOffset };
        if (isValidPosition(pos, boardSize) && !isPieceAt(pos, allPieces, piece.player)) {
          moves.push(pos);
        }
      });
      break;

    case 'king':
      [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ].forEach(([rowOffset, colOffset]) => {
        const pos = { row: currentPos.row + rowOffset, col: currentPos.col + colOffset };
        if (isValidPosition(pos, boardSize) && !isPieceAt(pos, allPieces, piece.player)) {
          moves.push(pos);
        }
      });
      break;
  }

  return moves.filter(pos => isValidPosition(pos, boardSize));
}

/**
 * Helper to add moves along a line (for rook, bishop, queen)
 */
function addLineMoves(
  from: Position,
  directions: number[][],
  allPieces: Piece[],
  player: Player,
  moves: Position[],
  boardSize: number
): void {
  directions.forEach(([rowDir, colDir]) => {
    let row = from.row + rowDir;
    let col = from.col + colDir;

    while (isValidPosition({ row, col }, boardSize)) {
      const pos = { row, col };
      const pieceAtPos = getPieceAt(pos, allPieces);

      if (pieceAtPos) {
        if (pieceAtPos.player !== player) {
          moves.push(pos);
        }
        break;
      }

      moves.push(pos);
      row += rowDir;
      col += colDir;
    }
  });
}

/**
 * Check if position is valid on board
 */
export function isValidPosition(pos: Position, boardSize: number = 8): boolean {
  return pos.row >= 0 && pos.row < boardSize && pos.col >= 0 && pos.col < boardSize;
}

/**
 * Check if there's a piece at a position
 */
export function isPieceAt(pos: Position, pieces: Piece[], player?: Player): boolean {
  return pieces.some(piece =>
    piece.quantumStates.some(state =>
      positionsEqual(state.position, pos) &&
      state.probability > 0.3 && // Consider only significant probabilities
      (!player || piece.player === player)
    )
  );
}

/**
 * Get piece at position (considering probabilities)
 */
export function getPieceAt(pos: Position, pieces: Piece[]): Piece | null {
  const candidates = pieces.filter(piece =>
    piece.quantumStates.some(state =>
      positionsEqual(state.position, pos) && state.probability > 0.3
    )
  );

  if (candidates.length === 0) return null;

  // Return piece with highest probability at this position
  return candidates.reduce((max, piece) => {
    const maxProb = Math.max(
      ...piece.quantumStates
        .filter(s => positionsEqual(s.position, pos))
        .map(s => s.probability)
    );
    const currentMaxProb = Math.max(
      ...max.quantumStates
        .filter(s => positionsEqual(s.position, pos))
        .map(s => s.probability)
    );
    return maxProb > currentMaxProb ? piece : max;
  });
}

/**
 * Check if king is in check
 */
export function isInCheck(kingPlayer: Player, pieces: Piece[]): boolean {
  const king = pieces.find(p => p.type === 'king' && p.player === kingPlayer);
  if (!king) return false;

  const kingPos = king.quantumStates.reduce((max, state) =>
    state.probability > max.probability ? state : max
  ).position;

  const opponentPieces = pieces.filter(p => p.player !== kingPlayer);

  return opponentPieces.some(piece => {
    const possibleMoves = getPossibleMoves(piece, pieces);
    return possibleMoves.some(move => positionsEqual(move, kingPos));
  });
}

/**
 * Check if move is valid
 */
export function isValidMove(piece: Piece, targetPos: Position, allPieces: Piece[]): boolean {
  const possibleMoves = getPossibleMoves(piece, allPieces);
  return possibleMoves.some(move => positionsEqual(move, targetPos));
}
