/**
 * Quantum Chess - Type Definitions
 * Centralized TypeScript types for the entire game
 */

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type Player = 'white' | 'black';
export type GameMode = 'tutorial' | 'levels' | 'vs-ai' | 'multiplayer';
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'quantum-master';
export type QuantumEventType = 'tunneling' | 'interference' | 'decoherence';
export type AnimationType = 'superposition' | 'collapse' | 'entanglement' | 'tunneling' | 'interference';

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
  type: QuantumEventType;
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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface QuantumAnimation {
  id: string;
  type: AnimationType;
  positions: Position[];
  duration: number;
  timestamp: number;
}

export interface QuantumVisualization {
  position: Position;
  probability: number;
  isGhost: boolean;
  opacity: number;
}

export interface MoveEvaluation {
  piece: Piece;
  targetPosition: Position;
  score: number;
  quantumAdvantage: number;
}

export interface LevelConfig {
  level: number;
  focus: string;
  description: string;
  difficulty: AIDifficulty;
  requiredConcepts: string[];
  bonusObjectives?: string[];
}

export interface TutorialStep {
  title: string;
  content: string;
  concept: string;
  example: string;
  icon: string;
}

export interface GameConfig {
  boardSize: number;
  enableQuantumMechanics: boolean;
  decoherenceRate: number;
  tunnelingProbability: number;
  interferenceProbability: number;
  eventProbability: number;
  maxSuperpositionStates: number;
}

export interface AISettings {
  thinkingTime: number;
  usesQuantumMechanics: boolean;
  measurementFrequency: number;
  superpositionUsage: number;
}

// Re-export from quantum mechanics
export type {
  Piece as QuantumPiece,
  Position as BoardPosition,
  QuantumState as QuantumStateVector
};
