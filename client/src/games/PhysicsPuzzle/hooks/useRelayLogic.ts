import { useState, useCallback } from 'react';
import { PuzzleLevel } from '../data/puzzles';

export interface RelayPlayer {
  id: number;
  name: string;
  color: string;
  score: number;
  timeSpent: number;
  completed: boolean;
  objectsUsed: number;
  attempts: number;
}

export interface RelayState {
  currentPlayerIndex: number;
  players: RelayPlayer[];
  totalScore: number;
  totalTime: number;
  isComplete: boolean;
  puzzleSequence: PuzzleLevel[];
  effects: RelayEffect[];
}

export interface RelayEffect {
  playerId: number;
  type: 'gravity' | 'friction' | 'wind' | 'time' | 'mass';
  description: string;
  modifier: number;
  active: boolean;
}

export interface RelayStats {
  averageTime: number;
  bestTime: number;
  worstTime: number;
  totalAttempts: number;
  efficiency: number; // score per object used
}

export const useRelayLogic = (playerCount: number, puzzleSequence: PuzzleLevel[]) => {
  const [relayState, setRelayState] = useState<RelayState>(() => {
    const colors = ['#4ade80', '#60a5fa', '#f472b6', '#facc15'];
    const players: RelayPlayer[] = [];

    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: i,
        name: `Player ${i + 1}`,
        color: colors[i % colors.length],
        score: 0,
        timeSpent: 0,
        completed: false,
        objectsUsed: 0,
        attempts: 0,
      });
    }

    return {
      currentPlayerIndex: 0,
      players,
      totalScore: 0,
      totalTime: 0,
      isComplete: false,
      puzzleSequence,
      effects: [],
    };
  });

  const [startTime, setStartTime] = useState<number>(0);

  // Start player's turn
  const startTurn = useCallback(() => {
    setStartTime(Date.now());
  }, []);

  // Complete current player's puzzle
  const completePuzzle = useCallback(
    (objectsUsed: number, isSuccess: boolean) => {
      const timeSpent = (Date.now() - startTime) / 1000;
      const currentPlayer = relayState.players[relayState.currentPlayerIndex];
      const currentPuzzle = puzzleSequence[relayState.currentPlayerIndex];

      let score = 0;
      if (isSuccess) {
        // Score based on efficiency and time
        const parDiff = currentPuzzle.par - objectsUsed;
        const timeBonus = Math.max(0, 60 - timeSpent);

        score = 1000; // Base score
        score += parDiff * 200; // Bonus for using fewer objects
        score += timeBonus * 10; // Time bonus
        score = Math.max(0, Math.round(score));
      }

      setRelayState((prev) => {
        const newPlayers = [...prev.players];
        newPlayers[prev.currentPlayerIndex] = {
          ...currentPlayer,
          score: currentPlayer.score + score,
          timeSpent: currentPlayer.timeSpent + timeSpent,
          completed: isSuccess,
          objectsUsed: objectsUsed,
          attempts: currentPlayer.attempts + 1,
        };

        const nextPlayerIndex = prev.currentPlayerIndex + 1;
        const isComplete = nextPlayerIndex >= playerCount;
        const totalScore = newPlayers.reduce((sum, p) => sum + p.score, 0);
        const totalTime = newPlayers.reduce((sum, p) => sum + p.timeSpent, 0);

        // Generate effect for next player if applicable
        let newEffects = [...prev.effects];
        if (!isComplete && isSuccess) {
          const effect = generateRelayEffect(prev.currentPlayerIndex, objectsUsed, timeSpent);
          if (effect) {
            newEffects.push(effect);
          }
        }

        return {
          ...prev,
          currentPlayerIndex: isComplete ? prev.currentPlayerIndex : nextPlayerIndex,
          players: newPlayers,
          totalScore,
          totalTime,
          isComplete,
          effects: newEffects,
        };
      });
    },
    [relayState.currentPlayerIndex, relayState.players, puzzleSequence, playerCount, startTime]
  );

  // Retry current puzzle
  const retryPuzzle = useCallback(() => {
    setRelayState((prev) => {
      const newPlayers = [...prev.players];
      const currentPlayer = newPlayers[prev.currentPlayerIndex];
      newPlayers[prev.currentPlayerIndex] = {
        ...currentPlayer,
        attempts: currentPlayer.attempts + 1,
      };

      return {
        ...prev,
        players: newPlayers,
      };
    });

    setStartTime(Date.now());
  }, [relayState.currentPlayerIndex]);

  // Skip to next player (for testing/practice)
  const skipPuzzle = useCallback(() => {
    setRelayState((prev) => {
      const nextPlayerIndex = prev.currentPlayerIndex + 1;
      const isComplete = nextPlayerIndex >= playerCount;

      return {
        ...prev,
        currentPlayerIndex: isComplete ? prev.currentPlayerIndex : nextPlayerIndex,
        isComplete,
      };
    });
  }, [playerCount]);

  // Get current player
  const getCurrentPlayer = useCallback((): RelayPlayer => {
    return relayState.players[relayState.currentPlayerIndex];
  }, [relayState.players, relayState.currentPlayerIndex]);

  // Get current puzzle
  const getCurrentPuzzle = useCallback((): PuzzleLevel | null => {
    if (relayState.currentPlayerIndex >= puzzleSequence.length) return null;
    return puzzleSequence[relayState.currentPlayerIndex];
  }, [relayState.currentPlayerIndex, puzzleSequence]);

  // Get active effects for current player
  const getActiveEffects = useCallback((): RelayEffect[] => {
    return relayState.effects.filter((e) => e.playerId === relayState.currentPlayerIndex && e.active);
  }, [relayState.effects, relayState.currentPlayerIndex]);

  // Calculate relay stats
  const getStats = useCallback((): RelayStats => {
    const completedPlayers = relayState.players.filter((p) => p.completed);

    if (completedPlayers.length === 0) {
      return {
        averageTime: 0,
        bestTime: 0,
        worstTime: 0,
        totalAttempts: 0,
        efficiency: 0,
      };
    }

    const times = completedPlayers.map((p) => p.timeSpent);
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    const bestTime = Math.min(...times);
    const worstTime = Math.max(...times);
    const totalAttempts = relayState.players.reduce((sum, p) => sum + p.attempts, 0);

    const totalObjects = relayState.players.reduce((sum, p) => sum + p.objectsUsed, 0);
    const efficiency = totalObjects > 0 ? relayState.totalScore / totalObjects : 0;

    return {
      averageTime,
      bestTime,
      worstTime,
      totalAttempts,
      efficiency,
    };
  }, [relayState.players, relayState.totalScore]);

  // Reset relay
  const reset = useCallback(() => {
    const colors = ['#4ade80', '#60a5fa', '#f472b6', '#facc15'];
    const players: RelayPlayer[] = [];

    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: i,
        name: `Player ${i + 1}`,
        color: colors[i % colors.length],
        score: 0,
        timeSpent: 0,
        completed: false,
        objectsUsed: 0,
        attempts: 0,
      });
    }

    setRelayState({
      currentPlayerIndex: 0,
      players,
      totalScore: 0,
      totalTime: 0,
      isComplete: false,
      puzzleSequence,
      effects: [],
    });

    setStartTime(0);
  }, [playerCount, puzzleSequence]);

  return {
    relayState,
    startTurn,
    completePuzzle,
    retryPuzzle,
    skipPuzzle,
    getCurrentPlayer,
    getCurrentPuzzle,
    getActiveEffects,
    getStats,
    reset,
  };
};

// Generate relay effect based on previous player's performance
function generateRelayEffect(playerId: number, objectsUsed: number, timeSpent: number): RelayEffect | null {
  const effects: Omit<RelayEffect, 'playerId' | 'active'>[] = [
    {
      type: 'gravity',
      description: objectsUsed > 5 ? 'Heavy gravity from overuse' : 'Light gravity from efficiency',
      modifier: objectsUsed > 5 ? 1.3 : 0.8,
    },
    {
      type: 'friction',
      description: timeSpent > 30 ? 'Increased friction from time pressure' : 'Reduced friction from speed',
      modifier: timeSpent > 30 ? 1.4 : 0.7,
    },
    {
      type: 'wind',
      description: 'Wind from previous player\'s momentum',
      modifier: Math.min(1, timeSpent / 60),
    },
    {
      type: 'mass',
      description: objectsUsed > 4 ? 'Heavier objects from complexity' : 'Normal mass',
      modifier: objectsUsed > 4 ? 1.5 : 1.0,
    },
  ];

  // Select effect based on player ID to ensure variety
  const selectedEffect = effects[playerId % effects.length];

  return {
    playerId: playerId + 1,
    ...selectedEffect,
    active: true,
  };
}
