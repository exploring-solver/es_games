// Game Types
export type GameMode = 'single' | 'multiplayer' | 'daily' | 'tournament';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type QuizStatus = 'setup' | 'playing' | 'paused' | 'completed';

// Player Types
export interface PlayerStats {
  totalGames: number;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  bestScore: number;
  favoriteCategory: string;
  totalPlayTime: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  accuracy: number;
  completionTime: number;
  category?: string;
  date: Date;
}

export interface GlobalLeaderboard {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
}

// Tournament Types
export interface TournamentPlayer {
  id: string;
  name: string;
  avatar: string;
  seed: number;
  score: number;
  wins: number;
  losses: number;
}

export interface TournamentMatch {
  id: string;
  round: number;
  matchNumber: number;
  player1: TournamentPlayer | null;
  player2: TournamentPlayer | null;
  winner: TournamentPlayer | null;
  score1: number;
  score2: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Tournament {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  status: 'registration' | 'in_progress' | 'completed';
  participants: TournamentPlayer[];
  matches: TournamentMatch[];
  currentRound: number;
  maxRounds: number;
  winner?: TournamentPlayer;
}

// Custom Quiz Types
export interface CustomQuiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  categories: string[];
  difficulty: Difficulty | 'mixed';
  questionCount: number;
  isPublic: boolean;
  plays: number;
  averageRating: number;
  tags: string[];
}

// Animation Types
export type AnimationType =
  | 'correct'
  | 'incorrect'
  | 'streak'
  | 'powerup'
  | 'levelup'
  | 'achievement';

export interface AnimationConfig {
  type: AnimationType;
  duration: number;
  particles?: boolean;
  sound?: string;
}

// Sound Types
export type SoundEffect =
  | 'correct'
  | 'incorrect'
  | 'tick'
  | 'buzzer'
  | 'powerup'
  | 'achievement'
  | 'victory'
  | 'defeat';

export interface SoundConfig {
  enabled: boolean;
  volume: number;
  effects: Record<SoundEffect, boolean>;
}

// Settings Types
export interface GameSettings {
  sound: SoundConfig;
  animations: boolean;
  difficulty: Difficulty | 'adaptive';
  timeLimit: 'default' | 'relaxed' | 'blitz';
  hints: boolean;
  explanations: boolean;
  theme: 'science' | 'space' | 'nature' | 'tech';
}

// Daily Challenge Types
export interface DailyChallenge {
  date: Date;
  seed: number;
  categories: string[];
  questionCount: number;
  participants: number;
  topScore: number;
  completed: boolean;
  playerScore?: number;
  playerRank?: number;
}

// Streak Types
export interface StreakInfo {
  current: number;
  longest: number;
  lastDate: Date;
  milestones: number[];
  rewards: StreakReward[];
}

export interface StreakReward {
  milestone: number;
  coins: number;
  powerUps?: string[];
  achievement?: string;
}

// Power-Up System Types
export interface PowerUpEffect {
  type: string;
  duration?: number;
  multiplier?: number;
  uses?: number;
}

export interface PowerUpInventory {
  [powerUpId: string]: {
    count: number;
    lastUsed?: Date;
  };
}

// Quiz Session Types
export interface QuizSession {
  id: string;
  mode: GameMode;
  startTime: Date;
  endTime?: Date;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  categories: string[];
  difficulty: Difficulty | 'mixed';
  powerUpsUsed: number;
  achievements: string[];
}

// Analytics Types
export interface QuizAnalytics {
  totalSessions: number;
  averageScore: number;
  averageAccuracy: number;
  categoryPerformance: Record<string, CategoryPerformance>;
  difficultyPerformance: Record<Difficulty, DifficultyPerformance>;
  timeOfDayPerformance: Record<string, number>;
  streakHistory: number[];
}

export interface CategoryPerformance {
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  lastPlayed: Date;
}

export interface DifficultyPerformance {
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  averageScore: number;
}
