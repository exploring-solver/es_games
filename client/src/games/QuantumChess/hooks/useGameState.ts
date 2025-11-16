/**
 * Quantum Chess - Game State Hook
 * Manages game state, moves, and game flow
 */

import { useState, useCallback, useEffect } from 'react';
import {
  Piece,
  Player,
  Position,
  GameState,
  QuantumEvent,
  PieceType,
  collapseQuantumState,
  isValidMove,
  getPieceAt,
  normalizeQuantumStates,
  positionsEqual,
  isInCheck,
  generateQuantumEvent,
  applyDecoherence,
  applyInterference,
  applyTunneling,
  entanglePieces
} from '../utils/quantumMechanics';
import { calculateAIMove, AIDifficulty } from '../utils/aiLogic';

export type GameMode = 'tutorial' | 'levels' | 'vs-ai' | 'multiplayer';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

interface UseGameStateReturn {
  gameState: GameState;
  gameMode: GameMode;
  currentLevel: number;
  selectedPiece: Piece | null;
  possibleMoves: Position[];
  achievements: Achievement[];
  gameOver: boolean;
  winner: Player | null;
  aiDifficulty: AIDifficulty;

  selectPiece: (piece: Piece) => void;
  movePiece: (targetPosition: Position, createSuperposition?: boolean) => void;
  measurePiece: (piece: Piece) => void;
  setGameMode: (mode: GameMode) => void;
  setLevel: (level: number) => void;
  setAIDifficulty: (difficulty: AIDifficulty) => void;
  resetGame: () => void;
  undoMove: () => void;
}

/**
 * Initialize standard chess board
 */
function initializeBoard(): Piece[] {
  const pieces: Piece[] = [];
  let idCounter = 0;

  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  // Black pieces
  backRow.forEach((type, col) => {
    pieces.push({
      id: `black-${type}-${col}`,
      type,
      player: 'black',
      quantumStates: [{ position: { row: 0, col }, probability: 1.0 }],
      isEntangled: false,
      hasMoved: false
    });
  });

  for (let col = 0; col < 8; col++) {
    pieces.push({
      id: `black-pawn-${col}`,
      type: 'pawn',
      player: 'black',
      quantumStates: [{ position: { row: 1, col }, probability: 1.0 }],
      isEntangled: false,
      hasMoved: false
    });
  }

  // White pieces
  for (let col = 0; col < 8; col++) {
    pieces.push({
      id: `white-pawn-${col}`,
      type: 'pawn',
      player: 'white',
      quantumStates: [{ position: { row: 6, col }, probability: 1.0 }],
      isEntangled: false,
      hasMoved: false
    });
  }

  backRow.forEach((type, col) => {
    pieces.push({
      id: `white-${type}-${col}`,
      type,
      player: 'white',
      quantumStates: [{ position: { row: 7, col }, probability: 1.0 }],
      isEntangled: false,
      hasMoved: false
    });
  });

  return pieces;
}

/**
 * Initialize achievements
 */
function initializeAchievements(): Achievement[] {
  return [
    { id: 'first-superposition', name: 'Quantum Leap', description: 'Create your first superposition', unlocked: false, icon: '🌊' },
    { id: 'first-entanglement', name: 'Spooky Action', description: 'Entangle two pieces', unlocked: false, icon: '🔗' },
    { id: 'first-measurement', name: 'Observer Effect', description: 'Measure a superposition', unlocked: false, icon: '👁️' },
    { id: 'survive-tunneling', name: 'Through the Wall', description: 'Experience quantum tunneling', unlocked: false, icon: '🌀' },
    { id: 'win-quantum', name: 'Quantum Master', description: 'Win using quantum mechanics', unlocked: false, icon: '⚛️' },
    { id: 'level-5', name: 'Quantum Apprentice', description: 'Complete 5 levels', unlocked: false, icon: '📚' },
    { id: 'level-10', name: 'Quantum Expert', description: 'Complete all 10 levels', unlocked: false, icon: '🏆' },
    { id: 'beat-master', name: 'Quantum Supreme', description: 'Defeat Quantum Master AI', unlocked: false, icon: '👑' },
    { id: 'decoherence', name: 'Entropy Master', description: 'Win while managing decoherence', unlocked: false, icon: '⚡' },
    { id: 'interference', name: 'Wave Function', description: 'Use interference strategically', unlocked: false, icon: '〰️' }
  ];
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>({
    pieces: initializeBoard(),
    currentPlayer: 'white',
    moveCount: 0,
    quantumEvents: [],
    decoherenceLevel: 0
  });

  const [gameMode, setGameMode] = useState<GameMode>('tutorial');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(initializeAchievements());
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [aiDifficulty, setAIDifficulty] = useState<AIDifficulty>('medium');
  const [moveHistory, setMoveHistory] = useState<GameState[]>([]);

  /**
   * Unlock achievement
   */
  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements(prev =>
      prev.map(ach =>
        ach.id === achievementId ? { ...ach, unlocked: true } : ach
      )
    );
  }, []);

  /**
   * Check for checkmate/stalemate
   */
  const checkGameEnd = useCallback((state: GameState): boolean => {
    const currentPlayerPieces = state.pieces.filter(p => p.player === state.currentPlayer);

    // Check if king exists
    const hasKing = currentPlayerPieces.some(p => p.type === 'king');
    if (!hasKing) {
      const opponent = state.currentPlayer === 'white' ? 'black' : 'white';
      setWinner(opponent);
      setGameOver(true);
      return true;
    }

    return false;
  }, []);

  /**
   * Apply quantum events
   */
  const applyQuantumEvents = useCallback((pieces: Piece[], event: QuantumEvent | null): Piece[] => {
    if (!event) return pieces;

    let modifiedPieces = [...pieces];

    switch (event.type) {
      case 'tunneling':
        modifiedPieces = modifiedPieces.map(piece => {
          if (event.affectedPieces.includes(piece.id)) {
            // Find a random nearby position for tunneling
            const currentPos = piece.quantumStates[0].position;
            const tunnelTarget = {
              row: Math.max(0, Math.min(7, currentPos.row + Math.floor(Math.random() * 3) - 1)),
              col: Math.max(0, Math.min(7, currentPos.col + Math.floor(Math.random() * 3) - 1))
            };
            return applyTunneling(piece, tunnelTarget);
          }
          return piece;
        });
        unlockAchievement('survive-tunneling');
        break;

      case 'interference':
        modifiedPieces = applyInterference(modifiedPieces);
        unlockAchievement('interference');
        break;

      case 'decoherence':
        modifiedPieces = modifiedPieces.map(piece => {
          if (event.affectedPieces.includes(piece.id)) {
            return applyDecoherence(piece, 0.15);
          }
          return piece;
        });
        unlockAchievement('decoherence');
        break;
    }

    return modifiedPieces;
  }, [unlockAchievement]);

  /**
   * Select piece
   */
  const selectPiece = useCallback((piece: Piece) => {
    if (piece.player !== gameState.currentPlayer) return;
    if (gameOver) return;

    setSelectedPiece(piece);

    // Calculate possible moves from most probable position
    const moves = piece.quantumStates.length > 0
      ? require('../utils/quantumMechanics').getPossibleMoves(piece, gameState.pieces)
      : [];

    setPossibleMoves(moves);
  }, [gameState, gameOver]);

  /**
   * Move piece
   */
  const movePiece = useCallback((targetPosition: Position, createSuperposition: boolean = false) => {
    if (!selectedPiece || gameOver) return;

    const isValid = isValidMove(selectedPiece, targetPosition, gameState.pieces);
    if (!isValid) return;

    // Save state for undo
    setMoveHistory(prev => [...prev, gameState]);

    let updatedPieces = [...gameState.pieces];

    // Handle capture
    const targetPiece = getPieceAt(targetPosition, updatedPieces);
    if (targetPiece && targetPiece.player !== selectedPiece.player) {
      updatedPieces = updatedPieces.filter(p => p.id !== targetPiece.id);
    }

    // Update selected piece position
    const pieceIndex = updatedPieces.findIndex(p => p.id === selectedPiece.id);
    if (pieceIndex === -1) return;

    let movedPiece: Piece;

    if (createSuperposition && selectedPiece.quantumStates.length === 1) {
      // Create superposition with current and target position
      movedPiece = {
        ...selectedPiece,
        quantumStates: normalizeQuantumStates([
          { position: selectedPiece.quantumStates[0].position, probability: 0.5 },
          { position: targetPosition, probability: 0.5 }
        ]),
        hasMoved: true
      };
      unlockAchievement('first-superposition');
    } else {
      // Classical move or move from superposition
      movedPiece = {
        ...selectedPiece,
        quantumStates: [{ position: targetPosition, probability: 1.0 }],
        hasMoved: true
      };
    }

    updatedPieces[pieceIndex] = movedPiece;

    // Check for entanglement opportunities (pieces close together)
    const nearbyPieces = updatedPieces.filter(p =>
      p.player === movedPiece.player &&
      p.id !== movedPiece.id &&
      Math.abs(p.quantumStates[0].position.row - targetPosition.row) <= 1 &&
      Math.abs(p.quantumStates[0].position.col - targetPosition.col) <= 1
    );

    if (nearbyPieces.length > 0 && Math.random() < 0.3) {
      const entangleTarget = nearbyPieces[0];
      const [entangled1, entangled2] = entanglePieces(movedPiece, entangleTarget);

      const idx1 = updatedPieces.findIndex(p => p.id === entangled1.id);
      const idx2 = updatedPieces.findIndex(p => p.id === entangled2.id);

      if (idx1 !== -1) updatedPieces[idx1] = entangled1;
      if (idx2 !== -1) updatedPieces[idx2] = entangled2;

      unlockAchievement('first-entanglement');
    }

    // Generate quantum event
    const quantumEvent = generateQuantumEvent(updatedPieces);
    if (quantumEvent) {
      updatedPieces = applyQuantumEvents(updatedPieces, quantumEvent);
    }

    // Apply gradual decoherence
    updatedPieces = updatedPieces.map(p => applyDecoherence(p, 0.02));

    const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';

    const newState: GameState = {
      pieces: updatedPieces,
      currentPlayer: nextPlayer,
      moveCount: gameState.moveCount + 1,
      lastMove: {
        pieceId: selectedPiece.id,
        from: selectedPiece.quantumStates[0].position,
        to: targetPosition
      },
      quantumEvents: quantumEvent ? [quantumEvent] : [],
      decoherenceLevel: gameState.decoherenceLevel + 0.01
    };

    setGameState(newState);
    setSelectedPiece(null);
    setPossibleMoves([]);

    // Check game end
    checkGameEnd(newState);

    // AI move if in vs-ai mode
    if (gameMode === 'vs-ai' && nextPlayer === 'black') {
      setTimeout(() => {
        makeAIMove(newState);
      }, 1000);
    }
  }, [selectedPiece, gameState, gameOver, gameMode, unlockAchievement, applyQuantumEvents, checkGameEnd]);

  /**
   * Make AI move
   */
  const makeAIMove = useCallback((state: GameState) => {
    const aiMove = calculateAIMove(state.pieces, 'black', aiDifficulty);
    if (!aiMove) return;

    let updatedPieces = state.pieces.filter(p => p.id !== aiMove.piece.id);

    // Handle capture
    aiMove.move.quantumStates.forEach(qState => {
      const targetPiece = getPieceAt(qState.position, updatedPieces);
      if (targetPiece && targetPiece.player !== aiMove.move.player) {
        updatedPieces = updatedPieces.filter(p => p.id !== targetPiece.id);
      }
    });

    updatedPieces.push(aiMove.move);

    // Generate quantum event
    const quantumEvent = generateQuantumEvent(updatedPieces);
    if (quantumEvent) {
      updatedPieces = applyQuantumEvents(updatedPieces, quantumEvent);
    }

    const newState: GameState = {
      pieces: updatedPieces,
      currentPlayer: 'white',
      moveCount: state.moveCount + 1,
      lastMove: {
        pieceId: aiMove.piece.id,
        from: aiMove.piece.quantumStates[0].position,
        to: aiMove.move.quantumStates[0].position
      },
      quantumEvents: quantumEvent ? [quantumEvent] : [],
      decoherenceLevel: state.decoherenceLevel + 0.01
    };

    setGameState(newState);
    checkGameEnd(newState);
  }, [aiDifficulty, applyQuantumEvents, checkGameEnd]);

  /**
   * Measure/collapse piece superposition
   */
  const measurePiece = useCallback((piece: Piece) => {
    if (piece.quantumStates.length <= 1) return;

    const collapsedPiece = collapseQuantumState(piece);

    setGameState(prev => ({
      ...prev,
      pieces: prev.pieces.map(p =>
        p.id === piece.id ? collapsedPiece : p
      )
    }));

    unlockAchievement('first-measurement');
  }, [unlockAchievement]);

  /**
   * Reset game
   */
  const resetGame = useCallback(() => {
    setGameState({
      pieces: initializeBoard(),
      currentPlayer: 'white',
      moveCount: 0,
      quantumEvents: [],
      decoherenceLevel: 0
    });
    setSelectedPiece(null);
    setPossibleMoves([]);
    setGameOver(false);
    setWinner(null);
    setMoveHistory([]);
  }, []);

  /**
   * Undo last move
   */
  const undoMove = useCallback(() => {
    if (moveHistory.length === 0) return;

    const previousState = moveHistory[moveHistory.length - 1];
    setGameState(previousState);
    setMoveHistory(prev => prev.slice(0, -1));
    setSelectedPiece(null);
    setPossibleMoves([]);
  }, [moveHistory]);

  /**
   * Set level
   */
  const setLevel = useCallback((level: number) => {
    setCurrentLevel(level);

    // Unlock achievements
    if (level >= 5) unlockAchievement('level-5');
    if (level >= 10) unlockAchievement('level-10');

    // Adjust difficulty based on level
    if (level <= 3) setAIDifficulty('easy');
    else if (level <= 6) setAIDifficulty('medium');
    else if (level <= 9) setAIDifficulty('hard');
    else setAIDifficulty('quantum-master');
  }, [unlockAchievement]);

  return {
    gameState,
    gameMode,
    currentLevel,
    selectedPiece,
    possibleMoves,
    achievements,
    gameOver,
    winner,
    aiDifficulty,
    selectPiece,
    movePiece,
    measurePiece,
    setGameMode,
    setLevel,
    setAIDifficulty,
    resetGame,
    undoMove
  };
}
