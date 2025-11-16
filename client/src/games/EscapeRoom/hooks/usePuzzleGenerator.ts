import { useState, useEffect, useCallback } from 'react';
import { PuzzleData } from '../data/puzzles';
import { RoomData } from '../data/rooms';
import {
  generateRandomPuzzle,
  PuzzleState,
  checkPuzzleSolution,
  getNextHint,
  calculatePuzzleScore
} from '../utils/puzzleLogic';
import { getPuzzleById } from '../utils/roomGeneration';

export interface UsePuzzleGeneratorProps {
  room: RoomData;
  seed?: number;
  enableRandomGeneration?: boolean;
}

export interface PuzzleGeneratorState {
  currentPuzzle: PuzzleData | null;
  puzzleState: PuzzleState | null;
  availablePuzzles: PuzzleData[];
  solvedPuzzles: string[];
  totalScore: number;
  isGenerating: boolean;
}

export const usePuzzleGenerator = ({
  room,
  seed,
  enableRandomGeneration = true
}: UsePuzzleGeneratorProps) => {
  const [state, setState] = useState<PuzzleGeneratorState>({
    currentPuzzle: null,
    puzzleState: null,
    availablePuzzles: [],
    solvedPuzzles: [],
    totalScore: 0,
    isGenerating: false
  });

  /**
   * Initialize puzzles for the room
   */
  useEffect(() => {
    const puzzles: PuzzleData[] = [];

    // Load predefined puzzles
    room.availablePuzzles.forEach(puzzleId => {
      const puzzle = getPuzzleById(puzzleId);
      if (puzzle) {
        puzzles.push(puzzle);
      }
    });

    // Generate additional random puzzles if enabled
    if (enableRandomGeneration && seed !== undefined) {
      const additionalCount = Math.max(0, room.requiredPuzzleSolves - puzzles.length);
      for (let i = 0; i < additionalCount; i++) {
        try {
          const randomPuzzle = generateRandomPuzzle(
            room.theme === 'mixed' ? undefined : room.theme,
            room.difficulty,
            seed + i
          );
          puzzles.push(randomPuzzle);
        } catch (error) {
          console.warn('Failed to generate random puzzle:', error);
        }
      }
    }

    setState(prev => ({
      ...prev,
      availablePuzzles: puzzles
    }));
  }, [room, seed, enableRandomGeneration]);

  /**
   * Start a puzzle
   */
  const startPuzzle = useCallback((puzzle: PuzzleData) => {
    const newPuzzleState: PuzzleState = {
      puzzleId: puzzle.id,
      attempts: 0,
      hintsUsed: 0,
      solved: false,
      startTime: Date.now(),
      playersSolved: []
    };

    setState(prev => ({
      ...prev,
      currentPuzzle: puzzle,
      puzzleState: newPuzzleState
    }));
  }, []);

  /**
   * Submit a solution attempt
   */
  const submitSolution = useCallback((
    answer: string | string[],
    playerId: string
  ): { correct: boolean; message: string; score?: number } => {
    if (!state.currentPuzzle || !state.puzzleState) {
      return { correct: false, message: 'No active puzzle' };
    }

    const result = checkPuzzleSolution(
      state.currentPuzzle,
      answer,
      state.puzzleState
    );

    if (result.correct) {
      const solveTime = Date.now() - state.puzzleState.startTime;
      const score = calculatePuzzleScore(
        state.currentPuzzle,
        {
          ...state.puzzleState,
          solved: true,
          solveTime,
          playersSolved: [...state.puzzleState.playersSolved, playerId]
        },
        true
      );

      setState(prev => ({
        ...prev,
        puzzleState: prev.puzzleState ? {
          ...prev.puzzleState,
          solved: true,
          solveTime,
          playersSolved: [...prev.puzzleState.playersSolved, playerId]
        } : null,
        solvedPuzzles: [...prev.solvedPuzzles, state.currentPuzzle!.id],
        totalScore: prev.totalScore + score
      }));

      return {
        correct: true,
        message: result.message,
        score
      };
    } else {
      setState(prev => ({
        ...prev,
        puzzleState: prev.puzzleState ? {
          ...prev.puzzleState,
          attempts: prev.puzzleState.attempts + 1
        } : null
      }));

      return {
        correct: false,
        message: result.message
      };
    }
  }, [state.currentPuzzle, state.puzzleState]);

  /**
   * Request a hint
   */
  const requestHint = useCallback((): string | null => {
    if (!state.currentPuzzle || !state.puzzleState) {
      return null;
    }

    const hint = getNextHint(state.currentPuzzle, state.puzzleState.hintsUsed);

    if (hint) {
      setState(prev => ({
        ...prev,
        puzzleState: prev.puzzleState ? {
          ...prev.puzzleState,
          hintsUsed: prev.puzzleState.hintsUsed + 1
        } : null
      }));
    }

    return hint;
  }, [state.currentPuzzle, state.puzzleState]);

  /**
   * Close current puzzle
   */
  const closePuzzle = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPuzzle: null,
      puzzleState: null
    }));
  }, []);

  /**
   * Get remaining puzzles to solve
   */
  const getRemainingPuzzles = useCallback((): PuzzleData[] => {
    return state.availablePuzzles.filter(
      puzzle => !state.solvedPuzzles.includes(puzzle.id)
    );
  }, [state.availablePuzzles, state.solvedPuzzles]);

  /**
   * Check if room is complete
   */
  const isRoomComplete = useCallback((): boolean => {
    return state.solvedPuzzles.length >= room.requiredPuzzleSolves;
  }, [state.solvedPuzzles.length, room.requiredPuzzleSolves]);

  /**
   * Get puzzle progress
   */
  const getPuzzleProgress = useCallback(() => {
    return {
      solved: state.solvedPuzzles.length,
      total: room.requiredPuzzleSolves,
      percentage: Math.round((state.solvedPuzzles.length / room.requiredPuzzleSolves) * 100)
    };
  }, [state.solvedPuzzles.length, room.requiredPuzzleSolves]);

  /**
   * Reset puzzle generator
   */
  const reset = useCallback(() => {
    setState({
      currentPuzzle: null,
      puzzleState: null,
      availablePuzzles: [],
      solvedPuzzles: [],
      totalScore: 0,
      isGenerating: false
    });
  }, []);

  /**
   * Add player to solved list (for coop puzzles)
   */
  const addPlayerSolved = useCallback((playerId: string) => {
    setState(prev => ({
      ...prev,
      puzzleState: prev.puzzleState ? {
        ...prev.puzzleState,
        playersSolved: [...prev.puzzleState.playersSolved, playerId]
      } : null
    }));
  }, []);

  return {
    // State
    currentPuzzle: state.currentPuzzle,
    puzzleState: state.puzzleState,
    availablePuzzles: state.availablePuzzles,
    solvedPuzzles: state.solvedPuzzles,
    totalScore: state.totalScore,

    // Actions
    startPuzzle,
    submitSolution,
    requestHint,
    closePuzzle,
    getRemainingPuzzles,
    isRoomComplete,
    getPuzzleProgress,
    reset,
    addPlayerSolved
  };
};

export default usePuzzleGenerator;
