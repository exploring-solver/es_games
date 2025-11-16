import { PuzzleData, puzzleTemplates, ItemData } from '../data/puzzles';

export interface PuzzleState {
  puzzleId: string;
  attempts: number;
  hintsUsed: number;
  solved: boolean;
  startTime: number;
  solveTime?: number;
  playersSolved: string[];
}

export interface PuzzleAttemptResult {
  correct: boolean;
  message: string;
  hint?: string;
  rewardItems?: string[];
}

/**
 * Check if a puzzle solution is correct
 */
export const checkPuzzleSolution = (
  puzzle: PuzzleData,
  userAnswer: string | string[],
  currentState: PuzzleState
): PuzzleAttemptResult => {
  const isArray = Array.isArray(puzzle.solution);
  const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
  const solutionArray = Array.isArray(puzzle.solution) ? puzzle.solution : [puzzle.solution];

  let correct = false;

  if (isArray) {
    // For array solutions, check if all elements match (order matters for some puzzles)
    correct = solutionArray.length === userAnswerArray.length &&
      solutionArray.every((sol, idx) =>
        sol.toLowerCase().trim() === userAnswerArray[idx]?.toLowerCase().trim()
      );
  } else {
    // For single solutions, do case-insensitive comparison
    correct = solutionArray[0].toLowerCase().trim() ===
      userAnswerArray[0]?.toLowerCase().trim();
  }

  if (correct) {
    const solveTime = Date.now() - currentState.startTime;
    return {
      correct: true,
      message: `Correct! Puzzle solved in ${Math.floor(solveTime / 1000)} seconds.`,
      rewardItems: puzzle.rewardItems
    };
  } else {
    const attemptsRemaining = 5 - (currentState.attempts + 1);
    let message = `Incorrect. ${attemptsRemaining} attempts remaining.`;

    // Provide hint after 2 failed attempts
    let hint: string | undefined;
    if (currentState.attempts === 2 && currentState.hintsUsed === 0) {
      hint = puzzle.hint1;
      message += ' Here\'s a hint: ' + hint;
    }

    return {
      correct: false,
      message,
      hint
    };
  }
};

/**
 * Get the next hint for a puzzle
 */
export const getNextHint = (
  puzzle: PuzzleData,
  hintsUsed: number
): string | null => {
  const hints = [puzzle.hint1, puzzle.hint2, puzzle.hint3];
  if (hintsUsed >= hints.length) {
    return null;
  }
  return hints[hintsUsed];
};

/**
 * Calculate score for solving a puzzle
 */
export const calculatePuzzleScore = (
  puzzle: PuzzleData,
  state: PuzzleState,
  timeBonus: boolean = true
): number => {
  if (!state.solved || !state.solveTime) return 0;

  let baseScore = 100;

  // Difficulty multiplier
  const difficultyMultiplier = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0
  };
  baseScore *= difficultyMultiplier[puzzle.difficulty];

  // Deduct points for hints used
  const hintPenalty = state.hintsUsed * 10;
  baseScore -= hintPenalty;

  // Deduct points for incorrect attempts
  const attemptPenalty = state.attempts * 5;
  baseScore -= attemptPenalty;

  // Time bonus (if within time limit and enabled)
  if (timeBonus && puzzle.timeLimit) {
    const timeUsed = state.solveTime / 1000;
    if (timeUsed < puzzle.timeLimit) {
      const timeRatio = 1 - (timeUsed / puzzle.timeLimit);
      baseScore += timeRatio * 50;
    }
  }

  return Math.max(Math.round(baseScore), 10); // Minimum 10 points
};

/**
 * Check if items can be combined
 */
export const canCombineItems = (
  items: ItemData[],
  selectedItems: string[]
): { canCombine: boolean; result?: string; message: string } => {
  if (selectedItems.length < 2) {
    return {
      canCombine: false,
      message: 'Select at least 2 items to combine.'
    };
  }

  // Predefined combinations
  const combinations: { [key: string]: string } = {
    'iron_rod,battery,water_sample': 'master_key',
    'battery,water_sample,iron_rod': 'master_key',
    'water_sample,iron_rod,battery': 'master_key',
    'litmus_paper,beaker': 'ph_test_kit',
    'mirrors,beam_splitter': 'advanced_optics',
    'dna_sample,petri_dish,culture_medium': 'cell_culture',
    'geiger_counter,radiation_shield': 'rad_safe_kit'
  };

  const sortedKeys = selectedItems.sort().join(',');
  const result = combinations[sortedKeys];

  if (result) {
    return {
      canCombine: true,
      result,
      message: `Successfully created: ${result.replace(/_/g, ' ')}`
    };
  }

  return {
    canCombine: false,
    message: 'These items cannot be combined.'
  };
};

/**
 * Generate a random puzzle based on template
 */
export const generateRandomPuzzle = (
  type?: PuzzleData['type'],
  difficulty?: PuzzleData['difficulty'],
  seed?: number
): PuzzleData => {
  const templates = puzzleTemplates.filter(t =>
    (!type || t.type === type) &&
    (!difficulty || t.difficulty === difficulty)
  );

  if (templates.length === 0) {
    throw new Error('No matching puzzle templates found');
  }

  const randomSeed = seed || Math.floor(Math.random() * 10000);
  const template = templates[randomSeed % templates.length];
  const generatedData = template.generator(randomSeed);

  return {
    id: `generated_${randomSeed}`,
    type: template.type,
    difficulty: template.difficulty,
    title: generatedData.title || 'Generated Puzzle',
    description: generatedData.description || 'Solve this puzzle',
    hint1: generatedData.hint1 || 'Think carefully about the problem.',
    hint2: generatedData.hint2 || 'Consider all the information given.',
    hint3: generatedData.hint3 || 'The solution follows a pattern.',
    solution: generatedData.solution || 'SOLUTION',
    educationalContent: generatedData.educationalContent || 'Science is fascinating!',
    requiredItems: generatedData.requiredItems,
    rewardItems: generatedData.rewardItems
  };
};

/**
 * Validate if players can attempt a puzzle
 */
export const canAttemptPuzzle = (
  puzzle: PuzzleData,
  playersPresent: number,
  playerInventories: { [playerId: string]: string[] }
): { canAttempt: boolean; reason?: string } => {
  // Check player requirement
  if (puzzle.requiredPlayers && playersPresent < puzzle.requiredPlayers) {
    return {
      canAttempt: false,
      reason: `This puzzle requires ${puzzle.requiredPlayers} players. Only ${playersPresent} present.`
    };
  }

  // Check required items
  if (puzzle.requiredItems && puzzle.requiredItems.length > 0) {
    const allItems = new Set<string>();
    Object.values(playerInventories).forEach(inventory => {
      inventory.forEach(item => allItems.add(item));
    });

    const missingItems = puzzle.requiredItems.filter(item => !allItems.has(item));
    if (missingItems.length > 0) {
      return {
        canAttempt: false,
        reason: `Missing required items: ${missingItems.join(', ')}`
      };
    }
  }

  return { canAttempt: true };
};

/**
 * Calculate cooperative bonus for multi-player puzzle solving
 */
export const calculateCooperativeBonus = (
  playersSolved: string[],
  requiredPlayers?: number
): number => {
  if (!requiredPlayers || requiredPlayers <= 1) return 0;

  if (playersSolved.length >= requiredPlayers) {
    return 25 * requiredPlayers; // 25 points per required player
  }

  return 0;
};

/**
 * Get difficulty-based time limit suggestions
 */
export const getRecommendedTimeLimit = (
  difficulty: PuzzleData['difficulty'],
  type: PuzzleData['type']
): number => {
  const baseTime = {
    easy: 120,
    medium: 180,
    hard: 300
  };

  const typeMultiplier = {
    chemistry: 1.2,
    physics: 1.0,
    biology: 1.3,
    math: 0.9,
    logic: 1.0,
    pattern: 0.8,
    combination: 1.1
  };

  return Math.round(baseTime[difficulty] * typeMultiplier[type]);
};

/**
 * Format time remaining for display
 */
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds < 0) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Check if puzzle is time-critical
 */
export const isTimeCritical = (puzzle: PuzzleData, timeRemaining?: number): boolean => {
  if (!puzzle.timeLimit || !timeRemaining) return false;

  return timeRemaining < puzzle.timeLimit * 0.25; // Critical if less than 25% time remaining
};

/**
 * Generate puzzle difficulty progression
 */
export const generateDifficultyProgression = (
  roomNumber: number,
  totalRooms: number
): PuzzleData['difficulty'] => {
  const progress = roomNumber / totalRooms;

  if (progress < 0.33) return 'easy';
  if (progress < 0.66) return 'medium';
  return 'hard';
};

/**
 * Validate puzzle answer format
 */
export const validateAnswerFormat = (
  puzzle: PuzzleData,
  answer: string | string[]
): { valid: boolean; message?: string } => {
  if (Array.isArray(puzzle.solution)) {
    if (!Array.isArray(answer)) {
      return {
        valid: false,
        message: 'This puzzle requires multiple answers. Please provide all parts.'
      };
    }
    if (answer.length !== puzzle.solution.length) {
      return {
        valid: false,
        message: `This puzzle requires exactly ${puzzle.solution.length} answers.`
      };
    }
  } else {
    if (Array.isArray(answer)) {
      return {
        valid: false,
        message: 'This puzzle requires a single answer.'
      };
    }
  }

  return { valid: true };
};

export default {
  checkPuzzleSolution,
  getNextHint,
  calculatePuzzleScore,
  canCombineItems,
  generateRandomPuzzle,
  canAttemptPuzzle,
  calculateCooperativeBonus,
  getRecommendedTimeLimit,
  formatTimeRemaining,
  isTimeCritical,
  generateDifficultyProgression,
  validateAnswerFormat
};
