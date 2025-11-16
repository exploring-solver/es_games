/**
 * Psychology AI Hook for Mind Readers' Duel
 * Manages AI opponent behavior and adaptive learning
 */

import { useState, useCallback, useEffect } from 'react';
import {
  AIState,
  AIDecision,
  AIPersonality,
  initializeAI,
  makeAIDecision,
  updateOpponentModel,
  getAIHint
} from '../utils/aiPrediction';
import { PatternHistory } from '../utils/probabilityEngine';

export interface GameResult {
  playerChoice: string;
  playerPrediction: string;
  aiChoice: string;
  aiPrediction: string;
  playerPredictionCorrect: boolean;
  aiPredictionCorrect: boolean;
  roundNumber: number;
}

export interface UsePsychologyAIResult {
  aiState: AIState;
  makeMove: (
    playerHistory: PatternHistory,
    aiHistory: PatternHistory,
    possibleChoices: string[],
    roundNumber: number
  ) => AIDecision;
  processResult: (result: GameResult) => void;
  getHint: () => string;
  resetAI: (personality?: AIPersonality) => void;
  aiStats: {
    correctPredictions: number;
    totalPredictions: number;
    accuracy: number;
    currentStreak: number;
    longestStreak: number;
  };
  revealTells: boolean;
  toggleRevealTells: () => void;
}

/**
 * Hook for AI psychology and adaptive learning
 */
export function usePsychologyAI(initialPersonality: AIPersonality = 'intermediate'): UsePsychologyAIResult {
  const [aiState, setAIState] = useState<AIState>(() => initializeAI(initialPersonality));
  const [lastDecision, setLastDecision] = useState<AIDecision | null>(null);
  const [revealTells, setRevealTells] = useState(false);

  const [aiStats, setAIStats] = useState({
    correctPredictions: 0,
    totalPredictions: 0,
    accuracy: 0,
    currentStreak: 0,
    longestStreak: 0
  });

  /**
   * AI makes a move (choice and prediction)
   */
  const makeMove = useCallback((
    playerHistory: PatternHistory,
    aiHistory: PatternHistory,
    possibleChoices: string[],
    roundNumber: number
  ): AIDecision => {
    const decision = makeAIDecision(
      aiState,
      playerHistory,
      aiHistory,
      possibleChoices,
      roundNumber
    );

    setLastDecision(decision);
    return decision;
  }, [aiState]);

  /**
   * Process round result and update AI
   */
  const processResult = useCallback((result: GameResult) => {
    const { aiPredictionCorrect, playerPredictionCorrect } = result;

    // Update stats
    setAIStats(prev => {
      const newCorrect = prev.correctPredictions + (aiPredictionCorrect ? 1 : 0);
      const newTotal = prev.totalPredictions + 1;
      const newStreak = aiPredictionCorrect ? prev.currentStreak + 1 : 0;
      const newLongestStreak = Math.max(prev.longestStreak, newStreak);

      return {
        correctPredictions: newCorrect,
        totalPredictions: newTotal,
        accuracy: newTotal > 0 ? newCorrect / newTotal : 0,
        currentStreak: newStreak,
        longestStreak: newLongestStreak
      };
    });

    // Update AI's opponent model
    const wasPlayerPredictable = aiPredictionCorrect;
    const playerUsedMetaStrategy = !playerPredictionCorrect && !aiPredictionCorrect;

    setAIState(prevState =>
      updateOpponentModel(
        prevState,
        wasPlayerPredictable,
        playerUsedMetaStrategy,
        result.roundNumber
      )
    );

    // Adapt AI confidence based on performance
    setAIState(prevState => {
      const recentAccuracy = aiStats.correctPredictions / Math.max(aiStats.totalPredictions, 1);

      let newConfidence = prevState.confidenceLevel;

      if (recentAccuracy > 0.7) {
        newConfidence = Math.min(1, newConfidence + 0.05);
      } else if (recentAccuracy < 0.3) {
        newConfidence = Math.max(0.1, newConfidence - 0.05);
      }

      return {
        ...prevState,
        confidenceLevel: newConfidence
      };
    });
  }, [aiStats]);

  /**
   * Get a hint from AI
   */
  const getHint = useCallback((): string => {
    if (!lastDecision) {
      return "Make some moves first, and I'll share my insights!";
    }

    return getAIHint(aiState, lastDecision);
  }, [aiState, lastDecision]);

  /**
   * Reset AI to new personality
   */
  const resetAI = useCallback((personality?: AIPersonality) => {
    const newPersonality = personality || initialPersonality;
    setAIState(initializeAI(newPersonality));
    setLastDecision(null);
    setAIStats({
      correctPredictions: 0,
      totalPredictions: 0,
      accuracy: 0,
      currentStreak: 0,
      longestStreak: 0
    });
  }, [initialPersonality]);

  /**
   * Toggle reveal tells (for debugging/learning)
   */
  const toggleRevealTells = useCallback(() => {
    setRevealTells(prev => !prev);
  }, []);

  return {
    aiState,
    makeMove,
    processResult,
    getHint,
    resetAI,
    aiStats,
    revealTells,
    toggleRevealTells
  };
}

/**
 * Hook for AI difficulty scaling
 */
export function useAdaptiveDifficulty(
  playerWinRate: number,
  currentPersonality: AIPersonality
): AIPersonality {
  const [suggestedPersonality, setSuggestedPersonality] = useState<AIPersonality>(currentPersonality);

  useEffect(() => {
    // Adjust difficulty based on player performance
    if (playerWinRate > 0.7) {
      // Player is winning too much - increase difficulty
      if (currentPersonality === 'novice') setSuggestedPersonality('intermediate');
      else if (currentPersonality === 'intermediate') setSuggestedPersonality('expert');
      else if (currentPersonality === 'expert') setSuggestedPersonality('master');
    } else if (playerWinRate < 0.3) {
      // Player is losing too much - decrease difficulty
      if (currentPersonality === 'master') setSuggestedPersonality('expert');
      else if (currentPersonality === 'expert') setSuggestedPersonality('intermediate');
      else if (currentPersonality === 'intermediate') setSuggestedPersonality('novice');
    }
  }, [playerWinRate, currentPersonality]);

  return suggestedPersonality;
}

/**
 * Hook for tracking psychological profile
 */
export interface PsychologicalProfile {
  riskTolerance: number;
  patternAwareness: number;
  bluffFrequency: number;
  adaptability: number;
}

export function usePsychologicalProfile(history: PatternHistory): PsychologicalProfile {
  const [profile, setProfile] = useState<PsychologicalProfile>({
    riskTolerance: 0.5,
    patternAwareness: 0.5,
    bluffFrequency: 0.5,
    adaptability: 0.5
  });

  useEffect(() => {
    if (history.choices.length < 5) return;

    // Analyze choices to build profile
    const choices = history.choices;

    // Risk tolerance: tendency to choose extreme values
    const riskChoices = choices.filter(c => {
      const num = parseInt(c);
      if (isNaN(num)) return false;
      return num <= 2 || num >= 8;
    });
    const riskTolerance = riskChoices.length / choices.length;

    // Pattern awareness: how often patterns are broken
    let patternBreaks = 0;
    for (let i = 3; i < choices.length; i++) {
      const window = choices.slice(i - 3, i);
      const current = choices[i];

      // Check if choice breaks potential pattern
      if (window.every(w => w !== current)) {
        patternBreaks++;
      }
    }
    const patternAwareness = patternBreaks / Math.max(choices.length - 3, 1);

    // Bluff frequency: sudden changes in strategy
    let bluffCount = 0;
    for (let i = 4; i < choices.length; i++) {
      const recent = choices.slice(i - 4, i);
      const current = choices[i];

      // Check if current choice is different from recent trend
      const mostCommon = recent.reduce((acc, c) => {
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const trend = Object.entries(mostCommon).sort((a, b) => b[1] - a[1])[0]?.[0];

      if (trend && current !== trend) {
        bluffCount++;
      }
    }
    const bluffFrequency = bluffCount / Math.max(choices.length - 4, 1);

    // Adaptability: variety in choices
    const uniqueChoices = new Set(choices);
    const adaptability = uniqueChoices.size / Math.min(choices.length, 10);

    setProfile({
      riskTolerance: Math.max(0, Math.min(1, riskTolerance)),
      patternAwareness: Math.max(0, Math.min(1, patternAwareness)),
      bluffFrequency: Math.max(0, Math.min(1, bluffFrequency)),
      adaptability: Math.max(0, Math.min(1, adaptability))
    });
  }, [history.choices]);

  return profile;
}
