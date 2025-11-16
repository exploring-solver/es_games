export type ScenarioType =
  | 'maze'
  | 'pattern'
  | 'game'
  | 'classification'
  | 'optimization';

export interface Scenario {
  id: number;
  name: string;
  type: ScenarioType;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  objective: string;
  inputSize: number;
  outputSize: number;
  targetAccuracy: number;
  maxEpisodes: number;
  rewardStructure: string;
  educationalNote: string;
  color: string;
  initialConditionVariance: number; // 0-1, higher = more randomness
}

export const scenarios: Scenario[] = [
  {
    id: 1,
    name: 'Simple Maze Runner',
    type: 'maze',
    description: 'Train an AI to navigate a simple 5x5 maze to reach the goal',
    difficulty: 'easy',
    objective: 'Reach the goal in minimum steps',
    inputSize: 4, // up, down, left, right sensors
    outputSize: 4, // up, down, left, right actions
    targetAccuracy: 0.8,
    maxEpisodes: 100,
    rewardStructure: '+10 for goal, -1 per step, -5 for wall collision',
    educationalNote: 'Reinforcement learning basics: agents learn through trial and error',
    color: '#10B981',
    initialConditionVariance: 0.3
  },
  {
    id: 2,
    name: 'Pattern Recognition',
    type: 'pattern',
    description: 'Identify simple patterns in binary sequences',
    difficulty: 'easy',
    objective: 'Classify patterns with >80% accuracy',
    inputSize: 8,
    outputSize: 3, // pattern A, B, or C
    targetAccuracy: 0.85,
    maxEpisodes: 50,
    rewardStructure: '+1 for correct, -0.5 for incorrect',
    educationalNote: 'Supervised learning: training with labeled examples',
    color: '#3B82F6',
    initialConditionVariance: 0.4
  },
  {
    id: 3,
    name: 'Tic-Tac-Toe Master',
    type: 'game',
    description: 'Learn to play Tic-Tac-Toe optimally',
    difficulty: 'easy',
    objective: 'Win or draw every game',
    inputSize: 9, // 3x3 board state
    outputSize: 9, // 9 possible moves
    targetAccuracy: 0.9,
    maxEpisodes: 200,
    rewardStructure: '+10 for win, +5 for draw, -10 for loss',
    educationalNote: 'Game AI: learning strategies through self-play',
    color: '#8B5CF6',
    initialConditionVariance: 0.5
  },
  {
    id: 4,
    name: 'XOR Problem',
    type: 'classification',
    description: 'Solve the classic XOR classification problem',
    difficulty: 'medium',
    objective: 'Perfect XOR classification',
    inputSize: 2,
    outputSize: 1,
    targetAccuracy: 1.0,
    maxEpisodes: 100,
    rewardStructure: '+1 for correct, 0 for incorrect',
    educationalNote: 'Classic problem showing why deep networks matter',
    color: '#EF4444',
    initialConditionVariance: 0.2
  },
  {
    id: 5,
    name: 'Complex Maze',
    type: 'maze',
    description: 'Navigate a 10x10 maze with obstacles and traps',
    difficulty: 'medium',
    objective: 'Find optimal path to goal',
    inputSize: 8, // 8-direction sensors + distance info
    outputSize: 4,
    targetAccuracy: 0.75,
    maxEpisodes: 300,
    rewardStructure: '+20 for goal, -2 per step, -10 for trap',
    educationalNote: 'Exploration vs exploitation tradeoff',
    color: '#059669',
    initialConditionVariance: 0.6
  },
  {
    id: 6,
    name: 'Shape Classifier',
    type: 'classification',
    description: 'Classify geometric shapes from pixel data',
    difficulty: 'medium',
    objective: 'Identify circles, squares, triangles',
    inputSize: 16, // 4x4 grid
    outputSize: 3,
    targetAccuracy: 0.9,
    maxEpisodes: 150,
    rewardStructure: '+1 for correct, -0.3 for incorrect',
    educationalNote: 'Convolutional patterns in neural networks',
    color: '#F59E0B',
    initialConditionVariance: 0.5
  },
  {
    id: 7,
    name: 'Number Sequence Predictor',
    type: 'pattern',
    description: 'Predict next number in mathematical sequences',
    difficulty: 'medium',
    objective: 'Predict sequences accurately',
    inputSize: 5, // last 5 numbers
    outputSize: 1, // next number
    targetAccuracy: 0.85,
    maxEpisodes: 200,
    rewardStructure: '+1 for exact, +0.5 for close, 0 for wrong',
    educationalNote: 'Recurrent networks and temporal patterns',
    color: '#06B6D4',
    initialConditionVariance: 0.4
  },
  {
    id: 8,
    name: 'Cart Pole Balance',
    type: 'optimization',
    description: 'Balance a pole on a moving cart',
    difficulty: 'hard',
    objective: 'Keep pole upright for 500 steps',
    inputSize: 4, // position, velocity, angle, angular velocity
    outputSize: 2, // left or right
    targetAccuracy: 0.8,
    maxEpisodes: 400,
    rewardStructure: '+1 per step balanced, -100 for falling',
    educationalNote: 'Continuous control with policy gradients',
    color: '#EC4899',
    initialConditionVariance: 0.7
  },
  {
    id: 9,
    name: 'Snake Game AI',
    type: 'game',
    description: 'Play Snake and maximize score',
    difficulty: 'hard',
    objective: 'Survive and eat food efficiently',
    inputSize: 12, // direction to food, obstacles in 8 directions
    outputSize: 4, // up, down, left, right
    targetAccuracy: 0.7,
    maxEpisodes: 500,
    rewardStructure: '+10 per food, -1 per step, -50 for death',
    educationalNote: 'Sparse rewards and credit assignment problem',
    color: '#84CC16',
    initialConditionVariance: 0.8
  },
  {
    id: 10,
    name: 'Multi-Class Image Recognition',
    type: 'classification',
    description: 'Classify 5 different object types',
    difficulty: 'hard',
    objective: '>90% classification accuracy',
    inputSize: 25, // 5x5 pixel grid
    outputSize: 5,
    targetAccuracy: 0.92,
    maxEpisodes: 300,
    rewardStructure: '+2 for correct, -1 for incorrect',
    educationalNote: 'Feature extraction in deep learning',
    color: '#F97316',
    initialConditionVariance: 0.6
  },
  {
    id: 11,
    name: 'Pathfinding Optimizer',
    type: 'optimization',
    description: 'Find shortest path in dynamic environments',
    difficulty: 'hard',
    objective: 'Minimize path length and time',
    inputSize: 16, // environmental state
    outputSize: 8, // 8 directions
    targetAccuracy: 0.85,
    maxEpisodes: 350,
    rewardStructure: '+50 for optimal path, -0.1 per step',
    educationalNote: 'A* vs learned heuristics',
    color: '#14B8A6',
    initialConditionVariance: 0.7
  },
  {
    id: 12,
    name: 'Anomaly Detector',
    type: 'pattern',
    description: 'Detect unusual patterns in data streams',
    difficulty: 'hard',
    objective: 'Identify anomalies with precision',
    inputSize: 10,
    outputSize: 2, // normal or anomaly
    targetAccuracy: 0.88,
    maxEpisodes: 250,
    rewardStructure: '+5 for correct detection, -3 for false positive',
    educationalNote: 'Autoencoders and unsupervised learning',
    color: '#A855F7',
    initialConditionVariance: 0.5
  },
  {
    id: 13,
    name: 'Strategy Game AI',
    type: 'game',
    description: 'Compete in a resource management game',
    difficulty: 'hard',
    objective: 'Outperform opponent AI',
    inputSize: 20, // game state
    outputSize: 6, // possible actions
    targetAccuracy: 0.75,
    maxEpisodes: 600,
    rewardStructure: '+100 for win, -50 for loss, score differential',
    educationalNote: 'Monte Carlo Tree Search and planning',
    color: '#DC2626',
    initialConditionVariance: 0.9
  },
  {
    id: 14,
    name: 'Time Series Forecasting',
    type: 'pattern',
    description: 'Predict future values in time series data',
    difficulty: 'hard',
    objective: 'Accurate multi-step predictions',
    inputSize: 10, // historical data points
    outputSize: 3, // next 3 values
    targetAccuracy: 0.82,
    maxEpisodes: 400,
    rewardStructure: 'MSE-based reward: -1 * prediction_error',
    educationalNote: 'LSTM networks and sequence modeling',
    color: '#0EA5E9',
    initialConditionVariance: 0.6
  },
  {
    id: 15,
    name: 'Transfer Learning Challenge',
    type: 'optimization',
    description: 'Apply learning from one task to a similar task',
    difficulty: 'hard',
    objective: 'Leverage prior knowledge effectively',
    inputSize: 12,
    outputSize: 4,
    targetAccuracy: 0.88,
    maxEpisodes: 200,
    rewardStructure: '+20 for fast convergence, +10 for high accuracy',
    educationalNote: 'Transfer learning: building on previous knowledge',
    color: '#7C3AED',
    initialConditionVariance: 0.5
  }
];

export const getScenarioById = (id: number): Scenario | undefined => {
  return scenarios.find(s => s.id === id);
};

export const getScenariosByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Scenario[] => {
  return scenarios.filter(s => s.difficulty === difficulty);
};

export const getScenariosByType = (type: ScenarioType): Scenario[] => {
  return scenarios.filter(s => s.type === type);
};
