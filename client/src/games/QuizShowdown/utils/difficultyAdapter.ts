import { Question } from '../data/questionBank';

export interface PlayerSkill {
  playerId: string;
  skillLevel: number; // 0-100
  categorySkills: Record<string, number>; // Category-specific skills
  recentPerformance: number[]; // Last 10 scores
  streakCount: number;
  totalCorrect: number;
  totalAttempted: number;
}

export interface AdaptiveConfig {
  targetDifficulty: number; // 0-100
  adjustmentRate: number; // How quickly to adapt
  minDifficulty: number;
  maxDifficulty: number;
}

/**
 * Default adaptive configuration
 */
export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveConfig = {
  targetDifficulty: 50,
  adjustmentRate: 0.15,
  minDifficulty: 10,
  maxDifficulty: 90
};

/**
 * Initialize player skill profile
 */
export const initializePlayerSkill = (playerId: string): PlayerSkill => {
  return {
    playerId,
    skillLevel: 50, // Start at medium
    categorySkills: {},
    recentPerformance: [],
    streakCount: 0,
    totalCorrect: 0,
    totalAttempted: 0
  };
};

/**
 * Update player skill based on performance
 */
export const updatePlayerSkill = (
  skill: PlayerSkill,
  question: Question,
  isCorrect: boolean,
  timeTaken: number
): PlayerSkill => {
  const updated = { ...skill };

  // Update totals
  updated.totalAttempted += 1;
  if (isCorrect) updated.totalCorrect += 1;

  // Update streak
  if (isCorrect) {
    updated.streakCount += 1;
  } else {
    updated.streakCount = 0;
  }

  // Calculate performance score (0-100)
  const difficultyWeight = getDifficultyWeight(question.difficulty);
  const timeScore = Math.max(0, (question.timeLimit - timeTaken) / question.timeLimit);
  const performanceScore = isCorrect ? (difficultyWeight * 25 + timeScore * 75) : 0;

  // Update recent performance
  updated.recentPerformance.push(performanceScore);
  if (updated.recentPerformance.length > 10) {
    updated.recentPerformance.shift();
  }

  // Update overall skill level
  const averageRecent = updated.recentPerformance.reduce((a, b) => a + b, 0) / updated.recentPerformance.length;
  updated.skillLevel = Math.min(100, Math.max(0, updated.skillLevel * 0.9 + averageRecent * 0.1));

  // Update category-specific skill
  const categorySkill = updated.categorySkills[question.category] || 50;
  updated.categorySkills[question.category] = Math.min(
    100,
    Math.max(0, categorySkill * 0.85 + performanceScore * 0.15)
  );

  return updated;
};

/**
 * Get difficulty weight for scoring
 */
const getDifficultyWeight = (difficulty: string): number => {
  const weights = {
    easy: 1,
    medium: 2,
    hard: 3,
    expert: 4
  };
  return weights[difficulty as keyof typeof weights] || 2;
};

/**
 * Determine appropriate difficulty for player
 */
export const getRecommendedDifficulty = (
  skill: PlayerSkill,
  category?: string
): 'easy' | 'medium' | 'hard' | 'expert' => {
  let targetSkill = skill.skillLevel;

  // Use category-specific skill if available
  if (category && skill.categorySkills[category] !== undefined) {
    targetSkill = skill.categorySkills[category];
  }

  // Map skill level to difficulty
  if (targetSkill < 30) return 'easy';
  if (targetSkill < 55) return 'medium';
  if (targetSkill < 80) return 'hard';
  return 'expert';
};

/**
 * Calculate difficulty score for a question
 */
export const getQuestionDifficulty = (question: Question): number => {
  const baseScores = {
    easy: 25,
    medium: 50,
    hard: 75,
    expert: 100
  };
  return baseScores[question.difficulty];
};

/**
 * Select questions adapted to player skill
 */
export const selectAdaptiveQuestions = (
  availableQuestions: Question[],
  playerSkill: PlayerSkill,
  count: number,
  category?: string
): Question[] => {
  const targetDifficulty = getRecommendedDifficulty(playerSkill, category);

  // Get questions matching target difficulty
  const targetQuestions = availableQuestions.filter(q => q.difficulty === targetDifficulty);

  // If not enough, add adjacent difficulties
  if (targetQuestions.length < count) {
    const adjacentDifficulties = getAdjacentDifficulties(targetDifficulty);
    const additionalQuestions = availableQuestions.filter(q =>
      adjacentDifficulties.includes(q.difficulty)
    );
    targetQuestions.push(...additionalQuestions);
  }

  // Shuffle and return requested count
  const shuffled = [...targetQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * Get adjacent difficulty levels
 */
const getAdjacentDifficulties = (difficulty: string): string[] => {
  const order = ['easy', 'medium', 'hard', 'expert'];
  const index = order.indexOf(difficulty);

  const adjacent: string[] = [];
  if (index > 0) adjacent.push(order[index - 1]);
  if (index < order.length - 1) adjacent.push(order[index + 1]);

  return adjacent;
};

/**
 * Calculate adaptive multiplier for points
 */
export const getAdaptiveMultiplier = (
  playerSkill: PlayerSkill,
  questionDifficulty: string
): number => {
  const playerLevel = playerSkill.skillLevel;
  const questionLevel = getDifficultyWeight(questionDifficulty) * 25;

  // Reward players for answering harder questions relative to their skill
  const difference = questionLevel - playerLevel;

  if (difference > 20) return 1.5; // Challenging question
  if (difference > 0) return 1.2; // Slightly harder
  if (difference > -20) return 1.0; // Appropriate level
  return 0.8; // Too easy
};

/**
 * Get skill tier name
 */
export const getSkillTier = (skillLevel: number): string => {
  if (skillLevel >= 90) return 'Genius';
  if (skillLevel >= 75) return 'Expert';
  if (skillLevel >= 60) return 'Advanced';
  if (skillLevel >= 45) return 'Intermediate';
  if (skillLevel >= 30) return 'Beginner';
  return 'Novice';
};

/**
 * Calculate accuracy percentage
 */
export const getAccuracy = (skill: PlayerSkill): number => {
  if (skill.totalAttempted === 0) return 0;
  return Math.round((skill.totalCorrect / skill.totalAttempted) * 100);
};

/**
 * Get category mastery level
 */
export const getCategoryMastery = (skill: PlayerSkill, category: string): string => {
  const categorySkill = skill.categorySkills[category] || 50;

  if (categorySkill >= 85) return 'Master';
  if (categorySkill >= 70) return 'Expert';
  if (categorySkill >= 55) return 'Proficient';
  if (categorySkill >= 40) return 'Competent';
  return 'Learning';
};

/**
 * Predict success probability for a question
 */
export const predictSuccessProbability = (
  playerSkill: PlayerSkill,
  question: Question
): number => {
  const categorySkill = playerSkill.categorySkills[question.category] || playerSkill.skillLevel;
  const questionDifficulty = getQuestionDifficulty(question);

  // Calculate probability based on skill gap
  const skillGap = categorySkill - questionDifficulty;
  const baseProbability = 0.5;
  const adjustment = skillGap / 200; // Max ±0.5

  return Math.min(0.95, Math.max(0.05, baseProbability + adjustment));
};

/**
 * Generate skill report
 */
export const generateSkillReport = (skill: PlayerSkill) => {
  const accuracy = getAccuracy(skill);
  const tier = getSkillTier(skill.skillLevel);
  const strongCategories: string[] = [];
  const weakCategories: string[] = [];

  Object.entries(skill.categorySkills).forEach(([category, level]) => {
    if (level >= 70) strongCategories.push(category);
    if (level < 40) weakCategories.push(category);
  });

  return {
    tier,
    skillLevel: Math.round(skill.skillLevel),
    accuracy,
    streak: skill.streakCount,
    totalQuestions: skill.totalAttempted,
    strongCategories,
    weakCategories,
    recentPerformance: skill.recentPerformance.slice(-5)
  };
};

/**
 * Adjust difficulty in real-time based on performance
 */
export const adjustDifficultyDynamic = (
  currentDifficulty: string,
  recentCorrectCount: number,
  recentTotalCount: number
): string => {
  if (recentTotalCount < 3) return currentDifficulty;

  const accuracy = recentCorrectCount / recentTotalCount;

  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const currentIndex = difficulties.indexOf(currentDifficulty);

  // If too easy (>80% accuracy), increase difficulty
  if (accuracy > 0.8 && currentIndex < difficulties.length - 1) {
    return difficulties[currentIndex + 1];
  }

  // If too hard (<40% accuracy), decrease difficulty
  if (accuracy < 0.4 && currentIndex > 0) {
    return difficulties[currentIndex - 1];
  }

  return currentDifficulty;
};

/**
 * Calculate learning velocity (how fast player is improving)
 */
export const getLearningVelocity = (skill: PlayerSkill): number => {
  if (skill.recentPerformance.length < 5) return 0;

  const recent = skill.recentPerformance.slice(-5);
  const older = skill.recentPerformance.slice(-10, -5);

  if (older.length === 0) return 0;

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  return recentAvg - olderAvg; // Positive means improving, negative means declining
};

/**
 * Get personalized recommendations
 */
export const getRecommendations = (skill: PlayerSkill): string[] => {
  const recommendations: string[] = [];
  const accuracy = getAccuracy(skill);
  const velocity = getLearningVelocity(skill);

  if (accuracy < 50) {
    recommendations.push('Try focusing on easier questions to build confidence');
  }

  if (skill.streakCount === 0 && skill.totalAttempted > 5) {
    recommendations.push('Take your time reading questions carefully');
  }

  if (velocity < -10) {
    recommendations.push('Consider taking a break or reviewing fundamentals');
  }

  if (skill.categorySkills && Object.keys(skill.categorySkills).length > 3) {
    const weakest = Object.entries(skill.categorySkills)
      .sort(([, a], [, b]) => a - b)[0];
    if (weakest && weakest[1] < 40) {
      recommendations.push(`Practice more ${weakest[0]} questions to improve`);
    }
  }

  return recommendations;
};
