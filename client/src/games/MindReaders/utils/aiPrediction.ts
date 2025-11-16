/**
 * AI Prediction Engine for Mind Readers' Duel
 * Implements adaptive learning AI opponent with psychological modeling
 */

import {
  PatternHistory,
  BayesianProbability,
  calculateBayesianProbability,
  detectPatterns,
  calculateEntropy,
  predictCounterBluff
} from './probabilityEngine';

export type AIPersonality = 'novice' | 'intermediate' | 'expert' | 'master';

export type PsychologicalTell =
  | 'favors_high_numbers'
  | 'avoids_repetition'
  | 'pattern_follower'
  | 'contrarian'
  | 'gambler'
  | 'conservative'
  | 'mimics_opponent'
  | 'anti_mimics';

export interface AIState {
  personality: AIPersonality;
  tells: PsychologicalTell[];
  confidenceLevel: number;
  adaptationRate: number;
  bluffTendency: number;
  opponentModel: OpponentModel;
}

export interface OpponentModel {
  predictability: number; // 0-1, how predictable the opponent is
  sophistication: number; // 0-1, how likely to use meta-strategies
  riskTolerance: number; // 0-1, how likely to make risky choices
  patternAwareness: number; // 0-1, how likely they notice their own patterns
}

export interface AIDecision {
  choice: string;
  prediction: string;
  confidence: number;
  reasoning: string[];
  isBluff: boolean;
  tellsUsed: PsychologicalTell[];
}

/**
 * Initialize AI with personality and random tells
 */
export function initializeAI(personality: AIPersonality): AIState {
  const tells = generateRandomTells(personality);

  return {
    personality,
    tells,
    confidenceLevel: getBaseConfidence(personality),
    adaptationRate: getAdaptationRate(personality),
    bluffTendency: getBluffTendency(personality),
    opponentModel: {
      predictability: 0.5,
      sophistication: 0.5,
      riskTolerance: 0.5,
      patternAwareness: 0.5
    }
  };
}

/**
 * Generate random psychological tells for this game session
 */
function generateRandomTells(personality: AIPersonality): PsychologicalTell[] {
  const allTells: PsychologicalTell[] = [
    'favors_high_numbers',
    'avoids_repetition',
    'pattern_follower',
    'contrarian',
    'gambler',
    'conservative',
    'mimics_opponent',
    'anti_mimics'
  ];

  const tellCount = {
    novice: 1,
    intermediate: 2,
    expert: 2,
    master: 3
  }[personality];

  // Shuffle and take first N tells
  const shuffled = [...allTells].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, tellCount);
}

function getBaseConfidence(personality: AIPersonality): number {
  return {
    novice: 0.3,
    intermediate: 0.5,
    expert: 0.7,
    master: 0.9
  }[personality];
}

function getAdaptationRate(personality: AIPersonality): number {
  return {
    novice: 0.1,
    intermediate: 0.3,
    expert: 0.5,
    master: 0.7
  }[personality];
}

function getBluffTendency(personality: AIPersonality): number {
  return {
    novice: 0.1,
    intermediate: 0.2,
    expert: 0.3,
    master: 0.4
  }[personality];
}

/**
 * AI makes a choice and prediction
 */
export function makeAIDecision(
  aiState: AIState,
  playerHistory: PatternHistory,
  aiHistory: PatternHistory,
  possibleChoices: string[],
  roundNumber: number
): AIDecision {
  // Predict what player will choose
  const playerPredictions = calculateBayesianProbability(playerHistory, possibleChoices);
  const prediction = selectAIPrediction(aiState, playerPredictions, playerHistory, roundNumber);

  // Choose AI's own selection
  const choice = selectAIChoice(
    aiState,
    aiHistory,
    playerHistory,
    possibleChoices,
    roundNumber
  );

  // Determine if this is a bluff
  const isBluff = Math.random() < aiState.bluffTendency;

  // Calculate confidence
  const confidence = calculateAIConfidence(aiState, playerHistory, playerPredictions);

  // Generate reasoning
  const reasoning = generateReasoning(
    aiState,
    choice,
    prediction,
    playerHistory,
    playerPredictions
  );

  return {
    choice,
    prediction,
    confidence,
    reasoning,
    isBluff,
    tellsUsed: aiState.tells
  };
}

/**
 * AI selects its prediction of player's choice
 */
function selectAIPrediction(
  aiState: AIState,
  predictions: BayesianProbability[],
  playerHistory: PatternHistory,
  roundNumber: number
): string {
  const { personality, opponentModel, tells } = aiState;

  // Apply sophistication - consider counter-bluffs
  if (opponentModel.sophistication > 0.6 && predictions.length > 0) {
    // High sophistication players might predict we'll predict the obvious
    // So we might predict the second-most-likely choice
    if (Math.random() < opponentModel.sophistication) {
      return predictions[Math.min(1, predictions.length - 1)].choice;
    }
  }

  // Apply tells to prediction
  let modifiedPredictions = [...predictions];

  tells.forEach(tell => {
    modifiedPredictions = applyTellToPrediction(tell, modifiedPredictions, playerHistory);
  });

  // Novice AI is more random
  if (personality === 'novice' && Math.random() < 0.3) {
    return modifiedPredictions[Math.floor(Math.random() * modifiedPredictions.length)].choice;
  }

  // Return top prediction
  return modifiedPredictions[0].choice;
}

/**
 * AI selects its own choice
 */
function selectAIChoice(
  aiState: AIState,
  aiHistory: PatternHistory,
  playerHistory: PatternHistory,
  possibleChoices: string[],
  roundNumber: number
): string {
  const { tells, opponentModel } = aiState;

  // Detect if player is tracking our patterns
  if (opponentModel.patternAwareness > 0.7) {
    // Player is aware of patterns - be more random
    return possibleChoices[Math.floor(Math.random() * possibleChoices.length)];
  }

  // Apply tells to choice
  let candidateChoices = [...possibleChoices];

  tells.forEach(tell => {
    const filtered = applyTellToChoice(
      tell,
      candidateChoices,
      aiHistory,
      playerHistory,
      roundNumber
    );
    if (filtered.length > 0) {
      candidateChoices = filtered;
    }
  });

  // Add some randomness based on personality
  const randomness = {
    novice: 0.4,
    intermediate: 0.3,
    expert: 0.2,
    master: 0.1
  }[aiState.personality];

  if (Math.random() < randomness) {
    return possibleChoices[Math.floor(Math.random() * possibleChoices.length)];
  }

  return candidateChoices[Math.floor(Math.random() * candidateChoices.length)];
}

/**
 * Apply psychological tell to prediction
 */
function applyTellToPrediction(
  tell: PsychologicalTell,
  predictions: BayesianProbability[],
  playerHistory: PatternHistory
): BayesianProbability[] {
  const modified = predictions.map(p => ({ ...p }));

  switch (tell) {
    case 'favors_high_numbers':
      // Expect player to choose high numbers
      modified.forEach(p => {
        const num = parseInt(p.choice);
        if (!isNaN(num) && num > 5) {
          p.probability *= 1.3;
        }
      });
      break;

    case 'avoids_repetition':
      // Expect player to avoid recent choices
      const recent = playerHistory.choices.slice(-2);
      modified.forEach(p => {
        if (recent.includes(p.choice)) {
          p.probability *= 0.5;
        }
      });
      break;

    case 'pattern_follower':
      // Expect player to continue patterns
      const patterns = detectPatterns(playerHistory);
      if (patterns.length > 0) {
        // Boost probability of pattern continuation
        modified[0].probability *= 1.5;
      }
      break;

    case 'contrarian':
      // Expect player to choose opposite/different
      if (modified.length > 0) {
        // Boost least-chosen options
        const sorted = [...modified].sort((a, b) => a.probability - b.probability);
        const contrarian = sorted[0];
        const idx = modified.findIndex(p => p.choice === contrarian.choice);
        if (idx >= 0) {
          modified[idx].probability *= 1.5;
        }
      }
      break;
  }

  return modified.sort((a, b) => b.probability - a.probability);
}

/**
 * Apply psychological tell to AI's own choice
 */
function applyTellToChoice(
  tell: PsychologicalTell,
  choices: string[],
  aiHistory: PatternHistory,
  playerHistory: PatternHistory,
  roundNumber: number
): string[] {
  switch (tell) {
    case 'favors_high_numbers':
      const highNumbers = choices.filter(c => {
        const num = parseInt(c);
        return !isNaN(num) && num > 5;
      });
      return highNumbers.length > 0 ? highNumbers : choices;

    case 'avoids_repetition':
      const recent = aiHistory.choices.slice(-2);
      const nonRepeat = choices.filter(c => !recent.includes(c));
      return nonRepeat.length > 0 ? nonRepeat : choices;

    case 'pattern_follower':
      // Continue the pattern if one exists
      if (aiHistory.choices.length >= 2) {
        const last = aiHistory.choices[aiHistory.choices.length - 1];
        const num = parseInt(last);
        if (!isNaN(num)) {
          const next = (num + 1).toString();
          if (choices.includes(next)) {
            return [next];
          }
        }
      }
      return choices;

    case 'contrarian':
      // Choose differently from what's common
      const leastUsed = findLeastUsed(aiHistory.choices, choices);
      return leastUsed.length > 0 ? leastUsed : choices;

    case 'gambler':
      // More willing to take risks - choose extremes
      const nums = choices.map(c => parseInt(c)).filter(n => !isNaN(n));
      if (nums.length > 0) {
        const extremes = choices.filter(c => {
          const num = parseInt(c);
          return num === Math.min(...nums) || num === Math.max(...nums);
        });
        return extremes.length > 0 ? extremes : choices;
      }
      return choices;

    case 'conservative':
      // Choose middle values
      const numChoices = choices.map(c => parseInt(c)).filter(n => !isNaN(n));
      if (numChoices.length > 0) {
        const mid = numChoices.sort((a, b) => a - b)[Math.floor(numChoices.length / 2)];
        const midChoices = choices.filter(c => Math.abs(parseInt(c) - mid) <= 1);
        return midChoices.length > 0 ? midChoices : choices;
      }
      return choices;

    case 'mimics_opponent':
      // Choose what player recently chose
      if (playerHistory.choices.length > 0) {
        const lastPlayer = playerHistory.choices[playerHistory.choices.length - 1];
        if (choices.includes(lastPlayer)) {
          return [lastPlayer];
        }
      }
      return choices;

    case 'anti_mimics':
      // Choose opposite of what player chose
      if (playerHistory.choices.length > 0) {
        const lastPlayer = playerHistory.choices[playerHistory.choices.length - 1];
        const different = choices.filter(c => c !== lastPlayer);
        return different.length > 0 ? different : choices;
      }
      return choices;

    default:
      return choices;
  }
}

function findLeastUsed(history: string[], choices: string[]): string[] {
  const counts = new Map<string, number>();

  choices.forEach(c => counts.set(c, 0));
  history.forEach(c => counts.set(c, (counts.get(c) || 0) + 1));

  const minCount = Math.min(...Array.from(counts.values()));
  return choices.filter(c => counts.get(c) === minCount);
}

/**
 * Calculate AI's confidence in its prediction
 */
function calculateAIConfidence(
  aiState: AIState,
  playerHistory: PatternHistory,
  predictions: BayesianProbability[]
): number {
  const baseConfidence = aiState.confidenceLevel;
  const dataConfidence = predictions.length > 0 ? predictions[0].confidence : 0;

  // Adjust based on opponent model
  const modelConfidence = (
    aiState.opponentModel.predictability +
    (1 - aiState.opponentModel.sophistication) * 0.5
  ) / 1.5;

  return (baseConfidence * 0.4 + dataConfidence * 0.3 + modelConfidence * 0.3);
}

/**
 * Generate human-readable reasoning for AI decision
 */
function generateReasoning(
  aiState: AIState,
  choice: string,
  prediction: string,
  playerHistory: PatternHistory,
  predictions: BayesianProbability[]
): string[] {
  const reasoning: string[] = [];

  // Add personality-based reasoning
  reasoning.push(`Playing as ${aiState.personality} level`);

  // Add tell-based reasoning
  aiState.tells.forEach(tell => {
    reasoning.push(getTellExplanation(tell));
  });

  // Add prediction reasoning
  if (predictions.length > 0) {
    const topPred = predictions[0];
    reasoning.push(`Predicting based on ${topPred.reasoning[0] || 'analysis'}`);
  }

  // Add pattern detection
  const patterns = detectPatterns(playerHistory);
  if (patterns.length > 0) {
    reasoning.push(`Detected ${patterns[0].type} pattern (${(patterns[0].strength * 100).toFixed(0)}% strength)`);
  }

  return reasoning;
}

function getTellExplanation(tell: PsychologicalTell): string {
  return {
    favors_high_numbers: 'Tendency to prefer higher values',
    avoids_repetition: 'Avoids repeating recent choices',
    pattern_follower: 'Continues established patterns',
    contrarian: 'Chooses less common options',
    gambler: 'Takes risks with extreme choices',
    conservative: 'Prefers safe, middle values',
    mimics_opponent: 'Mirrors opponent behavior',
    anti_mimics: 'Actively avoids opponent choices'
  }[tell];
}

/**
 * Update AI's opponent model based on results
 */
export function updateOpponentModel(
  aiState: AIState,
  wasPlayerPredictable: boolean,
  playerUsedMetaStrategy: boolean,
  roundNumber: number
): AIState {
  const { adaptationRate, opponentModel } = aiState;

  // Update predictability
  const predictDelta = wasPlayerPredictable ? adaptationRate : -adaptationRate;
  const newPredictability = Math.max(0, Math.min(1,
    opponentModel.predictability + predictDelta
  ));

  // Update sophistication
  const sophDelta = playerUsedMetaStrategy ? adaptationRate : -adaptationRate * 0.5;
  const newSophistication = Math.max(0, Math.min(1,
    opponentModel.sophistication + sophDelta
  ));

  // Update pattern awareness (increases over time)
  const awarenessGrowth = roundNumber * 0.02;
  const newPatternAwareness = Math.min(1,
    opponentModel.patternAwareness + awarenessGrowth
  );

  return {
    ...aiState,
    opponentModel: {
      ...opponentModel,
      predictability: newPredictability,
      sophistication: newSophistication,
      patternAwareness: newPatternAwareness
    }
  };
}

/**
 * Get AI hint for player (reduces difficulty)
 */
export function getAIHint(aiState: AIState, aiDecision: AIDecision): string {
  const hints = [
    `I'm ${aiState.confidenceLevel > 0.7 ? 'very confident' : 'somewhat uncertain'} about my prediction`,
    `My tells include: ${aiState.tells[0] ? getTellExplanation(aiState.tells[0]) : 'hidden'}`,
    `I think you're ${aiState.opponentModel.predictability > 0.6 ? 'fairly predictable' : 'quite unpredictable'}`,
    `Pattern entropy suggests you're ${calculateEntropy(aiDecision.choice.split('')) > 1 ? 'random' : 'systematic'}`
  ];

  return hints[Math.floor(Math.random() * hints.length)];
}
