/**
 * Quantum Chess - AI Logic
 * Quantum-aware AI opponent with multiple difficulty levels
 */

import {
  Piece,
  Player,
  Position,
  QuantumState,
  getPossibleMoves,
  isValidMove,
  collapseQuantumState,
  createSuperposition,
  positionsEqual,
  calculateDistance,
  isInCheck,
  getPieceAt
} from './quantumMechanics';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'quantum-master';

interface MoveEvaluation {
  piece: Piece;
  targetPosition: Position;
  score: number;
  quantumAdvantage: number;
}

/**
 * Calculate piece value
 */
function getPieceValue(piece: Piece): number {
  const baseValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 100
  };

  let value = baseValues[piece.type];

  // Bonus for pieces in superposition (quantum advantage)
  if (piece.quantumStates.length > 1) {
    value *= 1.3;
  }

  // Bonus for entangled pieces
  if (piece.isEntangled) {
    value *= 1.2;
  }

  return value;
}

/**
 * Evaluate board position
 */
function evaluatePosition(pieces: Piece[], player: Player): number {
  let score = 0;

  pieces.forEach(piece => {
    const value = getPieceValue(piece);
    if (piece.player === player) {
      score += value;
    } else {
      score -= value;
    }
  });

  // Bonus for controlling center
  const centerPositions = [
    { row: 3, col: 3 }, { row: 3, col: 4 },
    { row: 4, col: 3 }, { row: 4, col: 4 }
  ];

  pieces.forEach(piece => {
    piece.quantumStates.forEach(state => {
      const isCenter = centerPositions.some(pos => positionsEqual(pos, state.position));
      if (isCenter) {
        const bonus = state.probability * 0.5;
        score += piece.player === player ? bonus : -bonus;
      }
    });
  });

  // Penalty for being in check
  if (isInCheck(player, pieces)) {
    score -= 5;
  }

  const opponent = player === 'white' ? 'black' : 'white';
  if (isInCheck(opponent, pieces)) {
    score += 5;
  }

  return score;
}

/**
 * Calculate quantum advantage of a move
 */
function calculateQuantumAdvantage(
  piece: Piece,
  targetPos: Position,
  allPieces: Piece[]
): number {
  let advantage = 0;

  // Advantage for creating superposition
  if (piece.quantumStates.length === 1) {
    advantage += 2;
  }

  // Advantage for maintaining superposition
  if (piece.quantumStates.length > 1) {
    advantage += piece.quantumStates.length * 0.5;
  }

  // Advantage for entanglement opportunities
  const nearbyPieces = allPieces.filter(p => {
    const distance = calculateDistance(
      p.quantumStates[0].position,
      targetPos
    );
    return distance < 3 && p.player === piece.player && p.id !== piece.id;
  });

  advantage += nearbyPieces.length * 0.3;

  // Advantage for attacking multiple positions
  const targetPiece = getPieceAt(targetPos, allPieces);
  if (targetPiece && targetPiece.quantumStates.length > 1) {
    advantage += 1.5;
  }

  return advantage;
}

/**
 * Evaluate all possible moves for a piece
 */
function evaluatePieceMoves(
  piece: Piece,
  allPieces: Piece[],
  difficulty: AIDifficulty
): MoveEvaluation[] {
  const possibleMoves = getPossibleMoves(piece, allPieces);
  const evaluations: MoveEvaluation[] = [];

  possibleMoves.forEach(targetPos => {
    // Simulate move
    const targetPiece = getPieceAt(targetPos, allPieces);
    let captureValue = 0;

    if (targetPiece && targetPiece.player !== piece.player) {
      captureValue = getPieceValue(targetPiece);

      // Consider probability of actual capture in superposition
      if (targetPiece.quantumStates.length > 1) {
        const probAtTarget = targetPiece.quantumStates.find(s =>
          positionsEqual(s.position, targetPos)
        )?.probability || 0;
        captureValue *= probAtTarget;
      }
    }

    // Position score
    const centerDistance = calculateDistance(targetPos, { row: 3.5, col: 3.5 });
    const positionScore = (7 - centerDistance) * 0.2;

    // Quantum advantage
    const quantumAdvantage = calculateQuantumAdvantage(piece, targetPos, allPieces);

    // Total score
    let score = captureValue + positionScore;

    // Add quantum consideration for harder difficulties
    if (difficulty === 'hard' || difficulty === 'quantum-master') {
      score += quantumAdvantage;
    }

    evaluations.push({
      piece,
      targetPosition: targetPos,
      score,
      quantumAdvantage
    });
  });

  return evaluations;
}

/**
 * Decide whether to collapse or maintain superposition
 */
function shouldCollapseSuperposition(
  piece: Piece,
  difficulty: AIDifficulty
): boolean {
  // Easy AI almost always collapses
  if (difficulty === 'easy') {
    return Math.random() < 0.8;
  }

  // Medium AI sometimes maintains
  if (difficulty === 'medium') {
    return Math.random() < 0.5;
  }

  // Hard AI strategic about collapse
  if (difficulty === 'hard') {
    // Collapse if one state has > 70% probability
    const maxProb = Math.max(...piece.quantumStates.map(s => s.probability));
    return maxProb > 0.7 || Math.random() < 0.3;
  }

  // Quantum Master maintains superposition when advantageous
  const entropy = -piece.quantumStates.reduce((sum, s) =>
    sum + (s.probability > 0 ? s.probability * Math.log(s.probability) : 0), 0
  );
  return entropy < 0.3; // Collapse when entropy is low
}

/**
 * Select move with quantum strategy
 */
function selectQuantumMove(
  evaluations: MoveEvaluation[],
  difficulty: AIDifficulty
): MoveEvaluation | null {
  if (evaluations.length === 0) return null;

  // Sort by score
  evaluations.sort((a, b) => b.score - a.score);

  if (difficulty === 'easy') {
    // Easy: 60% best move, 40% random
    if (Math.random() < 0.6) {
      return evaluations[0];
    } else {
      return evaluations[Math.floor(Math.random() * Math.min(5, evaluations.length))];
    }
  }

  if (difficulty === 'medium') {
    // Medium: 80% best moves, 20% random
    if (Math.random() < 0.8) {
      return evaluations[Math.floor(Math.random() * Math.min(3, evaluations.length))];
    } else {
      return evaluations[Math.floor(Math.random() * evaluations.length)];
    }
  }

  // Hard and Quantum Master: Choose best move with quantum considerations
  const topMoves = evaluations.slice(0, 3);

  if (difficulty === 'quantum-master') {
    // Quantum Master prefers moves with quantum advantage
    return topMoves.reduce((best, current) =>
      current.quantumAdvantage > best.quantumAdvantage ? current : best
    );
  }

  // Hard: Best move
  return evaluations[0];
}

/**
 * Create superposition for AI move
 */
function createAISuperposition(
  piece: Piece,
  primaryTarget: Position,
  allPieces: Piece[],
  difficulty: AIDifficulty
): Piece {
  // Easy difficulty rarely creates superposition
  if (difficulty === 'easy' && Math.random() < 0.9) {
    return {
      ...piece,
      quantumStates: [{ position: primaryTarget, probability: 1.0 }]
    };
  }

  // Medium sometimes creates superposition
  if (difficulty === 'medium' && Math.random() < 0.6) {
    return {
      ...piece,
      quantumStates: [{ position: primaryTarget, probability: 1.0 }]
    };
  }

  // Hard and Quantum Master strategically create superposition
  const possibleMoves = getPossibleMoves(piece, allPieces);

  // Find alternative strong moves
  const alternatives = possibleMoves
    .filter(pos => !positionsEqual(pos, primaryTarget))
    .sort(() => Math.random() - 0.5)
    .slice(0, difficulty === 'quantum-master' ? 2 : 1);

  if (alternatives.length === 0) {
    return {
      ...piece,
      quantumStates: [{ position: primaryTarget, probability: 1.0 }]
    };
  }

  // Create superposition
  const primaryProb = difficulty === 'quantum-master' ? 0.6 : 0.7;
  const alternativeProb = (1 - primaryProb) / alternatives.length;

  return {
    ...piece,
    quantumStates: [
      { position: primaryTarget, probability: primaryProb },
      ...alternatives.map(pos => ({ position: pos, probability: alternativeProb }))
    ]
  };
}

/**
 * Main AI move function
 */
export function calculateAIMove(
  pieces: Piece[],
  aiPlayer: Player,
  difficulty: AIDifficulty
): { piece: Piece; move: Piece } | null {
  const aiPieces = pieces.filter(p => p.player === aiPlayer);

  // Evaluate all possible moves
  const allEvaluations: MoveEvaluation[] = [];
  aiPieces.forEach(piece => {
    const evals = evaluatePieceMoves(piece, pieces, difficulty);
    allEvaluations.push(...evals);
  });

  // Select best move
  const selectedMove = selectQuantumMove(allEvaluations, difficulty);
  if (!selectedMove) return null;

  // Decide on superposition
  let movedPiece: Piece;

  if (difficulty === 'easy' || Math.random() < 0.3) {
    // Simple move
    movedPiece = {
      ...selectedMove.piece,
      quantumStates: [{ position: selectedMove.targetPosition, probability: 1.0 }],
      hasMoved: true
    };
  } else {
    // Quantum move with superposition
    movedPiece = createAISuperposition(
      selectedMove.piece,
      selectedMove.targetPosition,
      pieces,
      difficulty
    );
    movedPiece.hasMoved = true;
  }

  return {
    piece: selectedMove.piece,
    move: movedPiece
  };
}

/**
 * AI decision to measure/collapse opponent's superposition
 */
export function shouldAIMeasure(
  opponentPiece: Piece,
  difficulty: AIDifficulty
): boolean {
  if (opponentPiece.quantumStates.length <= 1) return false;

  // Easy: rarely measures
  if (difficulty === 'easy') {
    return Math.random() < 0.2;
  }

  // Medium: sometimes measures
  if (difficulty === 'medium') {
    return Math.random() < 0.4;
  }

  // Hard: strategic measurement
  if (difficulty === 'hard') {
    // Measure if piece is valuable and in uncertain state
    const pieceValue = getPieceValue(opponentPiece);
    const entropy = -opponentPiece.quantumStates.reduce((sum, s) =>
      sum + (s.probability > 0 ? s.probability * Math.log(s.probability) : 0), 0
    );
    return pieceValue > 3 && entropy > 0.5;
  }

  // Quantum Master: very strategic
  const maxProb = Math.max(...opponentPiece.quantumStates.map(s => s.probability));
  return maxProb < 0.6 && Math.random() < 0.7;
}

/**
 * Get AI difficulty settings
 */
export function getAIDifficultySettings(difficulty: AIDifficulty) {
  return {
    thinkingTime: {
      easy: 500,
      medium: 1000,
      hard: 1500,
      'quantum-master': 2000
    }[difficulty],
    usesQuantumMechanics: difficulty !== 'easy',
    measurementFrequency: {
      easy: 0.2,
      medium: 0.4,
      hard: 0.6,
      'quantum-master': 0.8
    }[difficulty],
    superpositionUsage: {
      easy: 0.1,
      medium: 0.3,
      hard: 0.6,
      'quantum-master': 0.9
    }[difficulty]
  };
}
