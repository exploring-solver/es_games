/**
 * Pattern Detection Hook for Mind Readers' Duel
 * Real-time pattern analysis and prediction suggestions
 */

import { useState, useEffect, useMemo } from 'react';
import {
  PatternHistory,
  PatternStrength,
  BayesianProbability,
  detectPatterns,
  calculateBayesianProbability,
  calculateEntropy,
  predictCounterBluff
} from '../utils/probabilityEngine';

export interface PatternInsight {
  patterns: PatternStrength[];
  predictions: BayesianProbability[];
  entropy: number;
  recommendation: string;
  confidence: number;
  counterBluffPredictions?: BayesianProbability[];
}

export interface UsePatternDetectionResult {
  analyzePatterns: (history: PatternHistory, possibleChoices: string[]) => PatternInsight;
  getRealtimeSuggestion: (
    yourHistory: PatternHistory,
    opponentHistory: PatternHistory,
    possibleChoices: string[]
  ) => string;
  calculateWinProbability: (
    yourPrediction: string,
    opponentHistory: PatternHistory
  ) => number;
  detectBluffAttempt: (
    opponentHistory: PatternHistory,
    recentChoices: string[]
  ) => boolean;
  analyzeMetaGame: (
    yourHistory: PatternHistory,
    opponentHistory: PatternHistory
  ) => {
    yourPredictability: number;
    opponentPredictability: number;
    metaLevel: number;
  };
}

/**
 * Hook for pattern detection and analysis
 */
export function usePatternDetection(): UsePatternDetectionResult {
  const [cachedAnalysis, setCachedAnalysis] = useState<Map<string, PatternInsight>>(new Map());

  /**
   * Analyze patterns in a player's history
   */
  const analyzePatterns = useMemo(() => {
    return (history: PatternHistory, possibleChoices: string[]): PatternInsight => {
      // Create cache key
      const cacheKey = history.choices.join(',');

      // Check cache
      if (cachedAnalysis.has(cacheKey)) {
        return cachedAnalysis.get(cacheKey)!;
      }

      // Detect patterns
      const patterns = detectPatterns(history);

      // Calculate predictions
      const predictions = calculateBayesianProbability(history, possibleChoices);

      // Calculate entropy
      const entropy = calculateEntropy(history.choices);

      // Generate recommendation
      const recommendation = generateRecommendation(patterns, predictions, entropy);

      // Calculate overall confidence
      const confidence = predictions.length > 0 ? predictions[0].confidence : 0;

      const insight: PatternInsight = {
        patterns,
        predictions,
        entropy,
        recommendation,
        confidence
      };

      // Cache result
      const newCache = new Map(cachedAnalysis);
      newCache.set(cacheKey, insight);
      setCachedAnalysis(newCache);

      return insight;
    };
  }, [cachedAnalysis]);

  /**
   * Get real-time suggestion for player
   */
  const getRealtimeSuggestion = useMemo(() => {
    return (
      yourHistory: PatternHistory,
      opponentHistory: PatternHistory,
      possibleChoices: string[]
    ): string => {
      // Analyze opponent patterns
      const opponentAnalysis = analyzePatterns(opponentHistory, possibleChoices);

      // Analyze your own patterns
      const yourAnalysis = analyzePatterns(yourHistory, possibleChoices);

      // Check if you're being too predictable
      if (yourAnalysis.entropy < 1.5 && yourHistory.choices.length > 5) {
        return "⚠️ You're becoming predictable! Consider breaking your pattern.";
      }

      // Check if opponent is predictable
      if (opponentAnalysis.entropy < 1.5 && opponentHistory.choices.length > 5) {
        const topPrediction = opponentAnalysis.predictions[0];
        return `🎯 Opponent shows ${opponentAnalysis.patterns[0]?.type} pattern. Predict: ${topPrediction.choice}`;
      }

      // Check for meta-gaming opportunity
      if (opponentAnalysis.confidence > 0.7) {
        return "🧠 High confidence prediction available - but beware of counter-bluffs!";
      }

      // General advice
      if (yourHistory.choices.length < 3) {
        return "📊 Building pattern database... More data needed for analysis.";
      }

      return "🎲 No clear patterns detected. Trust your intuition!";
    };
  }, [analyzePatterns]);

  /**
   * Calculate probability of winning a prediction
   */
  const calculateWinProbability = useMemo(() => {
    return (yourPrediction: string, opponentHistory: PatternHistory): number => {
      if (opponentHistory.choices.length === 0) return 0.5;

      // Get all possible choices from history
      const possibleChoices = Array.from(new Set(opponentHistory.choices));

      // Analyze opponent
      const analysis = analyzePatterns(opponentHistory, possibleChoices);

      // Find your prediction in the probabilities
      const predictionProb = analysis.predictions.find(p => p.choice === yourPrediction);

      return predictionProb ? predictionProb.probability : 1 / possibleChoices.length;
    };
  }, [analyzePatterns]);

  /**
   * Detect if opponent is attempting a bluff
   */
  const detectBluffAttempt = useMemo(() => {
    return (opponentHistory: PatternHistory, recentChoices: string[]): boolean => {
      if (opponentHistory.choices.length < 5) return false;

      const possibleChoices = Array.from(new Set(opponentHistory.choices));
      const analysis = analyzePatterns(opponentHistory, possibleChoices);

      // Check if recent choices break established patterns
      if (analysis.patterns.length > 0) {
        const strongestPattern = analysis.patterns[0];

        if (strongestPattern.strength > 0.6) {
          // There's a strong pattern - check if recent choices deviate
          const recent = recentChoices.slice(-2);
          const expectedByPattern = analysis.predictions[0].choice;

          if (recent.some(c => c !== expectedByPattern)) {
            // Deviation from pattern suggests possible bluff
            return true;
          }
        }
      }

      // Check for sudden entropy changes
      const recentEntropy = calculateEntropy(recentChoices);
      const overallEntropy = analysis.entropy;

      // Sudden randomness might indicate bluffing
      if (recentEntropy > overallEntropy * 1.5) {
        return true;
      }

      return false;
    };
  }, [analyzePatterns]);

  /**
   * Analyze meta-game strategies
   */
  const analyzeMetaGame = useMemo(() => {
    return (
      yourHistory: PatternHistory,
      opponentHistory: PatternHistory
    ) => {
      const possibleChoices = Array.from(new Set([
        ...yourHistory.choices,
        ...opponentHistory.choices
      ]));

      const yourAnalysis = analyzePatterns(yourHistory, possibleChoices);
      const opponentAnalysis = analyzePatterns(opponentHistory, possibleChoices);

      // Calculate predictability (inverse of entropy normalized)
      const maxEntropy = Math.log2(possibleChoices.length);
      const yourPredictability = maxEntropy > 0
        ? 1 - (yourAnalysis.entropy / maxEntropy)
        : 0;
      const opponentPredictability = maxEntropy > 0
        ? 1 - (opponentAnalysis.entropy / maxEntropy)
        : 0;

      // Calculate meta-level (how much counter-bluffing is happening)
      let metaLevel = 0;

      // Check if players are avoiding their own patterns
      if (yourHistory.choices.length > 5) {
        const recentYour = yourHistory.choices.slice(-3);
        const olderYour = yourHistory.choices.slice(0, -3);

        const recentEntropy = calculateEntropy(recentYour);
        const olderEntropy = calculateEntropy(olderYour);

        if (recentEntropy > olderEntropy * 1.3) {
          metaLevel += 0.3;
        }
      }

      // Check if opponent is avoiding their patterns
      if (opponentHistory.choices.length > 5) {
        const recentOpp = opponentHistory.choices.slice(-3);
        const olderOpp = opponentHistory.choices.slice(0, -3);

        const recentEntropy = calculateEntropy(recentOpp);
        const olderEntropy = calculateEntropy(olderOpp);

        if (recentEntropy > olderEntropy * 1.3) {
          metaLevel += 0.3;
        }
      }

      // Check for pattern breaking
      if (yourAnalysis.patterns.length > 0 && yourAnalysis.patterns[0].strength < 0.4) {
        metaLevel += 0.2;
      }

      if (opponentAnalysis.patterns.length > 0 && opponentAnalysis.patterns[0].strength < 0.4) {
        metaLevel += 0.2;
      }

      return {
        yourPredictability: Math.max(0, Math.min(1, yourPredictability)),
        opponentPredictability: Math.max(0, Math.min(1, opponentPredictability)),
        metaLevel: Math.max(0, Math.min(1, metaLevel))
      };
    };
  }, [analyzePatterns]);

  return {
    analyzePatterns,
    getRealtimeSuggestion,
    calculateWinProbability,
    detectBluffAttempt,
    analyzeMetaGame
  };
}

/**
 * Generate recommendation based on analysis
 */
function generateRecommendation(
  patterns: PatternStrength[],
  predictions: BayesianProbability[],
  entropy: number
): string {
  if (patterns.length === 0 || predictions.length === 0) {
    return 'Insufficient data for recommendation';
  }

  const topPattern = patterns[0];
  const topPrediction = predictions[0];

  if (topPattern.strength > 0.7) {
    return `Strong ${topPattern.type} pattern detected (${(topPattern.strength * 100).toFixed(0)}%). Predict: ${topPrediction.choice}`;
  }

  if (topPattern.strength > 0.5) {
    return `Moderate ${topPattern.type} pattern. Consider predicting: ${topPrediction.choice}`;
  }

  if (entropy > 2.0) {
    return 'High randomness detected. Predictions are unreliable.';
  }

  return `Weak patterns. Best guess: ${topPrediction.choice} (${(topPrediction.probability * 100).toFixed(0)}% likely)`;
}

/**
 * Hook for tracking pattern evolution over time
 */
export function usePatternEvolution(history: PatternHistory) {
  const [evolution, setEvolution] = useState<{
    snapshots: PatternStrength[][];
    timestamps: number[];
  }>({ snapshots: [], timestamps: [] });

  useEffect(() => {
    if (history.choices.length > 0 && history.choices.length % 3 === 0) {
      // Take snapshot every 3 rounds
      const patterns = detectPatterns(history);

      setEvolution(prev => ({
        snapshots: [...prev.snapshots, patterns],
        timestamps: [...prev.timestamps, Date.now()]
      }));
    }
  }, [history.choices.length]);

  return evolution;
}
