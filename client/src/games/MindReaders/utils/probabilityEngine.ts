/**
 * Probability Engine for Mind Readers' Duel
 * Implements Bayesian probability calculations and pattern analysis
 */

export interface PatternHistory {
  choices: string[];
  timestamps: number[];
  context: string[];
  roundNumber: number[];
}

export interface BayesianProbability {
  choice: string;
  probability: number;
  confidence: number;
  reasoning: string[];
}

export interface PatternStrength {
  type: 'sequential' | 'alternating' | 'random' | 'repetitive' | 'counter-predictive';
  strength: number;
  examples: string[];
}

/**
 * Calculate Bayesian probability for next choice based on history
 */
export function calculateBayesianProbability(
  history: PatternHistory,
  possibleChoices: string[],
  priorBias: Map<string, number> = new Map()
): BayesianProbability[] {
  if (history.choices.length === 0) {
    // No history - use uniform prior
    const uniformProb = 1 / possibleChoices.length;
    return possibleChoices.map(choice => ({
      choice,
      probability: priorBias.get(choice) || uniformProb,
      confidence: 0,
      reasoning: ['No historical data - using prior distribution']
    }));
  }

  const patterns = detectPatterns(history);
  const frequencies = calculateFrequencies(history.choices, possibleChoices);
  const recencyWeighted = calculateRecencyWeightedProbabilities(history.choices, possibleChoices);
  const contextual = calculateContextualProbabilities(history, possibleChoices);

  // Combine multiple probability sources using Bayesian updating
  return possibleChoices.map(choice => {
    const reasoning: string[] = [];
    let probability = priorBias.get(choice) || (1 / possibleChoices.length);

    // Update with frequency data (base rate)
    const freqProb = frequencies.get(choice) || 0;
    if (freqProb > 0) {
      probability = (probability + freqProb) / 2;
      reasoning.push(`Base frequency: ${(freqProb * 100).toFixed(1)}%`);
    }

    // Update with recency bias
    const recencyProb = recencyWeighted.get(choice) || 0;
    if (recencyProb > 0) {
      probability = probability * 0.6 + recencyProb * 0.4;
      reasoning.push(`Recent tendency: ${(recencyProb * 100).toFixed(1)}%`);
    }

    // Update with pattern detection
    const patternProb = calculatePatternBasedProbability(choice, patterns, history);
    if (patternProb > 0) {
      probability = probability * 0.5 + patternProb * 0.5;
      reasoning.push(`Pattern match: ${(patternProb * 100).toFixed(1)}%`);
    }

    // Update with contextual information
    const contextProb = contextual.get(choice) || 0;
    if (contextProb > 0) {
      probability = probability * 0.7 + contextProb * 0.3;
      reasoning.push(`Context similarity: ${(contextProb * 100).toFixed(1)}%`);
    }

    // Calculate confidence based on data quantity and consistency
    const confidence = calculateConfidence(history, patterns);

    return {
      choice,
      probability,
      confidence,
      reasoning
    };
  }).sort((a, b) => b.probability - a.probability);
}

/**
 * Detect patterns in player choices
 */
export function detectPatterns(history: PatternHistory): PatternStrength[] {
  const patterns: PatternStrength[] = [];
  const choices = history.choices;

  if (choices.length < 3) return patterns;

  // Sequential pattern (A, B, C, D...)
  const sequential = detectSequentialPattern(choices);
  if (sequential.strength > 0.3) patterns.push(sequential);

  // Alternating pattern (A, B, A, B...)
  const alternating = detectAlternatingPattern(choices);
  if (alternating.strength > 0.3) patterns.push(alternating);

  // Repetitive pattern (A, A, A...)
  const repetitive = detectRepetitivePattern(choices);
  if (repetitive.strength > 0.3) patterns.push(repetitive);

  // Random pattern (no discernible pattern)
  const random = detectRandomness(choices);
  if (random.strength > 0.5) patterns.push(random);

  // Counter-predictive (avoiding recent choices)
  const counterPredictive = detectCounterPredictive(choices);
  if (counterPredictive.strength > 0.3) patterns.push(counterPredictive);

  return patterns.sort((a, b) => b.strength - a.strength);
}

function detectSequentialPattern(choices: string[]): PatternStrength {
  let sequentialCount = 0;
  const examples: string[] = [];

  for (let i = 2; i < choices.length; i++) {
    const prev2 = choices[i - 2];
    const prev1 = choices[i - 1];
    const curr = choices[i];

    // Check if numeric sequence
    if (isNumericSequence([prev2, prev1, curr])) {
      sequentialCount++;
      examples.push(`${prev2} → ${prev1} → ${curr}`);
    }
  }

  return {
    type: 'sequential',
    strength: sequentialCount / Math.max(choices.length - 2, 1),
    examples: examples.slice(0, 3)
  };
}

function detectAlternatingPattern(choices: string[]): PatternStrength {
  let alternatingCount = 0;
  const examples: string[] = [];
  const seen = new Map<string, number>();

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    const lastSeen = seen.get(choice);

    if (lastSeen !== undefined && i - lastSeen === 2) {
      alternatingCount++;
      examples.push(`${choices[lastSeen]} at ${lastSeen} → ${choice} at ${i}`);
    }

    seen.set(choice, i);
  }

  return {
    type: 'alternating',
    strength: alternatingCount / Math.max(choices.length - 2, 1),
    examples: examples.slice(0, 3)
  };
}

function detectRepetitivePattern(choices: string[]): PatternStrength {
  let repetitiveCount = 0;
  const examples: string[] = [];

  for (let i = 1; i < choices.length; i++) {
    if (choices[i] === choices[i - 1]) {
      repetitiveCount++;
      examples.push(`Repeat: ${choices[i]}`);
    }
  }

  return {
    type: 'repetitive',
    strength: repetitiveCount / Math.max(choices.length - 1, 1),
    examples: examples.slice(0, 3)
  };
}

function detectRandomness(choices: string[]): PatternStrength {
  // Use runs test for randomness
  const uniqueChoices = Array.from(new Set(choices));
  if (uniqueChoices.length < 2) return { type: 'random', strength: 0, examples: [] };

  let runs = 1;
  for (let i = 1; i < choices.length; i++) {
    if (choices[i] !== choices[i - 1]) runs++;
  }

  const n = choices.length;
  const expectedRuns = n / 2;
  const randomness = Math.min(1, runs / (expectedRuns * 1.5));

  return {
    type: 'random',
    strength: randomness,
    examples: [`${runs} runs in ${n} choices`]
  };
}

function detectCounterPredictive(choices: string[]): PatternStrength {
  let counterCount = 0;
  const examples: string[] = [];
  const recentWindow = 3;

  for (let i = recentWindow; i < choices.length; i++) {
    const recent = choices.slice(i - recentWindow, i);
    const current = choices[i];

    if (!recent.includes(current)) {
      counterCount++;
      examples.push(`${current} avoided after ${recent.join(', ')}`);
    }
  }

  return {
    type: 'counter-predictive',
    strength: counterCount / Math.max(choices.length - recentWindow, 1),
    examples: examples.slice(0, 3)
  };
}

function calculateFrequencies(choices: string[], possibleChoices: string[]): Map<string, number> {
  const frequencies = new Map<string, number>();
  const total = choices.length;

  possibleChoices.forEach(choice => {
    const count = choices.filter(c => c === choice).length;
    frequencies.set(choice, total > 0 ? count / total : 0);
  });

  return frequencies;
}

function calculateRecencyWeightedProbabilities(
  choices: string[],
  possibleChoices: string[]
): Map<string, number> {
  const weighted = new Map<string, number>();
  const windowSize = Math.min(5, choices.length);

  if (windowSize === 0) {
    possibleChoices.forEach(choice => weighted.set(choice, 0));
    return weighted;
  }

  const recentChoices = choices.slice(-windowSize);
  const total = recentChoices.reduce((sum, _, i) => sum + (i + 1), 0);

  possibleChoices.forEach(choice => {
    let weightedSum = 0;
    recentChoices.forEach((c, i) => {
      if (c === choice) {
        weightedSum += (i + 1) / total;
      }
    });
    weighted.set(choice, weightedSum);
  });

  return weighted;
}

function calculateContextualProbabilities(
  history: PatternHistory,
  possibleChoices: string[]
): Map<string, number> {
  const contextual = new Map<string, number>();

  if (history.context.length === 0 || history.choices.length === 0) {
    possibleChoices.forEach(choice => contextual.set(choice, 0));
    return contextual;
  }

  const currentRound = history.roundNumber[history.roundNumber.length - 1] || 0;

  // Find similar contexts
  possibleChoices.forEach(choice => {
    let similarity = 0;
    let count = 0;

    for (let i = 0; i < history.context.length - 1; i++) {
      if (history.roundNumber[i] % 3 === currentRound % 3) {
        if (history.choices[i] === choice) {
          similarity += 1;
        }
        count++;
      }
    }

    contextual.set(choice, count > 0 ? similarity / count : 0);
  });

  return contextual;
}

function calculatePatternBasedProbability(
  choice: string,
  patterns: PatternStrength[],
  history: PatternHistory
): number {
  if (patterns.length === 0 || history.choices.length === 0) return 0;

  const strongestPattern = patterns[0];
  const lastChoice = history.choices[history.choices.length - 1];

  switch (strongestPattern.type) {
    case 'sequential':
      return isNextInSequence(lastChoice, choice) ? strongestPattern.strength : 0;

    case 'alternating':
      const prev = history.choices.length > 1 ? history.choices[history.choices.length - 2] : null;
      return prev === choice ? strongestPattern.strength : 0;

    case 'repetitive':
      return lastChoice === choice ? strongestPattern.strength : 0;

    case 'counter-predictive':
      const recent = history.choices.slice(-3);
      return !recent.includes(choice) ? strongestPattern.strength : 0;

    default:
      return 0;
  }
}

function calculateConfidence(history: PatternHistory, patterns: PatternStrength[]): number {
  const dataPoints = history.choices.length;
  const dataConfidence = Math.min(1, dataPoints / 10);

  const patternConfidence = patterns.length > 0 ? patterns[0].strength : 0;

  return (dataConfidence * 0.4 + patternConfidence * 0.6);
}

function isNumericSequence(values: string[]): boolean {
  const nums = values.map(v => {
    const n = parseInt(v);
    return isNaN(n) ? null : n;
  });

  if (nums.some(n => n === null)) return false;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i]! - nums[i - 1]! !== 1) return false;
  }

  return true;
}

function isNextInSequence(current: string, next: string): boolean {
  const curr = parseInt(current);
  const nxt = parseInt(next);

  if (isNaN(curr) || isNaN(nxt)) return false;

  return nxt === curr + 1;
}

/**
 * Calculate entropy of choices (measure of randomness)
 */
export function calculateEntropy(choices: string[]): number {
  if (choices.length === 0) return 0;

  const frequencies = new Map<string, number>();
  choices.forEach(choice => {
    frequencies.set(choice, (frequencies.get(choice) || 0) + 1);
  });

  let entropy = 0;
  const total = choices.length;

  frequencies.forEach(count => {
    const p = count / total;
    entropy -= p * Math.log2(p);
  });

  return entropy;
}

/**
 * Predict counter-bluff (opponent predicting your prediction)
 */
export function predictCounterBluff(
  opponentHistory: PatternHistory,
  yourPrediction: string,
  possibleChoices: string[]
): BayesianProbability[] {
  // If opponent is sophisticated, they might predict your prediction
  // and choose something different

  const probabilities = calculateBayesianProbability(opponentHistory, possibleChoices);

  return probabilities.map(prob => ({
    ...prob,
    probability: prob.choice === yourPrediction
      ? prob.probability * 0.3  // Less likely if they think you'll predict it
      : prob.probability * 1.2, // More likely if avoiding your prediction
    reasoning: [
      ...prob.reasoning,
      prob.choice === yourPrediction
        ? 'Counter-bluff: might avoid this choice'
        : 'Counter-bluff: might choose this instead'
    ]
  })).sort((a, b) => b.probability - a.probability);
}
