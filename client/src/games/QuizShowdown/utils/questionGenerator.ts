import { Question, getRandomQuestions, QUESTION_BANK } from '../data/questionBank';
import { Category } from '../data/categories';

export interface QuestionSet {
  questions: Question[];
  totalPoints: number;
  averageDifficulty: number;
}

export interface GeneratorConfig {
  count: number;
  categories?: string[];
  difficulty?: string;
  excludeIds?: string[];
  balanceDifficulty?: boolean;
}

/**
 * Generate a set of questions based on configuration
 */
export const generateQuestionSet = (config: GeneratorConfig): QuestionSet => {
  const { count, categories, difficulty, excludeIds = [], balanceDifficulty = false } = config;

  let pool = QUESTION_BANK.filter(q => !excludeIds.includes(q.id));

  // Filter by categories if specified
  if (categories && categories.length > 0) {
    pool = pool.filter(q => categories.includes(q.category));
  }

  // Filter by difficulty if specified
  if (difficulty) {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  // Balance difficulty if requested
  if (balanceDifficulty && !difficulty) {
    const questions = balancedDifficultySelection(pool, count);
    return createQuestionSet(questions);
  }

  // Random selection
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, count);

  return createQuestionSet(questions);
};

/**
 * Balance question selection across difficulty levels
 */
const balancedDifficultySelection = (pool: Question[], count: number): Question[] => {
  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const perDifficulty = Math.floor(count / difficulties.length);
  const remainder = count % difficulties.length;

  const selected: Question[] = [];

  difficulties.forEach((diff, index) => {
    const diffQuestions = pool.filter(q => q.difficulty === diff);
    const shuffled = [...diffQuestions].sort(() => Math.random() - 0.5);
    const take = perDifficulty + (index < remainder ? 1 : 0);
    selected.push(...shuffled.slice(0, take));
  });

  return selected.sort(() => Math.random() - 0.5);
};

/**
 * Create a question set with metadata
 */
const createQuestionSet = (questions: Question[]): QuestionSet => {
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const difficultyMap = { easy: 1, medium: 2, hard: 3, expert: 4 };
  const averageDifficulty = questions.reduce((sum, q) => sum + difficultyMap[q.difficulty], 0) / questions.length;

  return {
    questions,
    totalPoints,
    averageDifficulty
  };
};

/**
 * Generate daily challenge questions
 */
export const generateDailyChallenge = (): QuestionSet => {
  // Use date as seed for consistent daily questions
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  // Pseudo-random based on seed
  const seededRandom = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    const random = x - Math.floor(x);
    return Math.floor(random * (max - min + 1)) + min;
  };

  // Select 20 questions with balanced difficulty
  const pool = [...QUESTION_BANK];
  const shuffled = pool.sort(() => seededRandom(0, 100) - 50);

  return generateQuestionSet({
    count: 20,
    balanceDifficulty: true,
    excludeIds: []
  });
};

/**
 * Generate tournament round questions
 */
export const generateTournamentRound = (round: number, categories?: string[]): QuestionSet => {
  // Increase difficulty with each round
  const baseCount = 10;
  const config: GeneratorConfig = {
    count: baseCount,
    categories,
    balanceDifficulty: true
  };

  // Adjust difficulty distribution based on round
  if (round <= 2) {
    // Early rounds: more easy/medium
    return generateQuestionSet(config);
  } else if (round <= 4) {
    // Mid rounds: more medium/hard
    return generateQuestionSet(config);
  } else {
    // Finals: more hard/expert
    return generateQuestionSet(config);
  }
};

/**
 * Generate category-specific quiz
 */
export const generateCategoryQuiz = (category: string, count: number = 10): QuestionSet => {
  return generateQuestionSet({
    count,
    categories: [category],
    balanceDifficulty: true
  });
};

/**
 * Generate mixed category quiz
 */
export const generateMixedQuiz = (count: number = 10): QuestionSet => {
  return generateQuestionSet({
    count,
    balanceDifficulty: true
  });
};

/**
 * Generate custom quiz based on player preferences
 */
export const generateCustomQuiz = (
  categories: string[],
  difficulty: string | null,
  questionCount: number
): QuestionSet => {
  return generateQuestionSet({
    count: questionCount,
    categories: categories.length > 0 ? categories : undefined,
    difficulty: difficulty || undefined,
    balanceDifficulty: !difficulty
  });
};

/**
 * Get questions for quick match (4 players, fast-paced)
 */
export const generateQuickMatch = (): QuestionSet => {
  return generateQuestionSet({
    count: 15,
    balanceDifficulty: true
  });
};

/**
 * Shuffle questions in a set
 */
export const shuffleQuestions = (questions: Question[]): Question[] => {
  return [...questions].sort(() => Math.random() - 0.5);
};

/**
 * Get hint for a question (reveals one wrong answer)
 */
export const getQuestionHint = (question: Question): number[] => {
  const wrongAnswers = question.options
    .map((_, index) => index)
    .filter(index => index !== question.correctAnswer);

  // Return indices of two wrong answers to eliminate
  return [wrongAnswers[0], wrongAnswers[1]];
};

/**
 * Validate question answer
 */
export const validateAnswer = (question: Question, answerIndex: number): boolean => {
  return answerIndex === question.correctAnswer;
};

/**
 * Calculate points for answer based on time taken
 */
export const calculatePoints = (
  question: Question,
  timeTaken: number,
  isCorrect: boolean,
  powerUpMultiplier: number = 1
): number => {
  if (!isCorrect) return 0;

  const basePoints = question.points;
  const timeBonus = Math.max(0, (question.timeLimit - timeTaken) / question.timeLimit);
  const points = Math.floor(basePoints * (1 + timeBonus * 0.5) * powerUpMultiplier);

  return points;
};

/**
 * Get question statistics
 */
export const getQuestionStats = (questionId: string) => {
  const question = QUESTION_BANK.find(q => q.id === questionId);
  if (!question) return null;

  return {
    id: question.id,
    category: question.category,
    difficulty: question.difficulty,
    points: question.points,
    timeLimit: question.timeLimit
  };
};
