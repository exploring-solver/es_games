import { Scenario } from '../data/scenarios';
import { NetworkArchitecture } from '../data/architectures';
import { NetworkState, initializeNetwork, trainStep, predict } from './neuralNetSimulator';

export interface TrainingExample {
  input: number[];
  target: number[];
  reward?: number;
}

export interface EpisodeResult {
  episodeNumber: number;
  accuracy: number;
  loss: number;
  reward: number;
  steps: number;
  timestamp: number;
}

export interface TrainingState {
  network: NetworkState;
  episodes: EpisodeResult[];
  currentEpisode: number;
  isTraining: boolean;
  totalSteps: number;
  bestAccuracy: number;
  convergenceScore: number;
  overfittingRisk: number; // 0-1
  trainingData: TrainingExample[];
  validationData: TrainingExample[];
}

// Generate training data for a scenario
export const generateScenarioData = (
  scenario: Scenario,
  count: number,
  variance: number = 0.1
): TrainingExample[] => {
  const data: TrainingExample[] = [];

  for (let i = 0; i < count; i++) {
    const input: number[] = [];
    const target: number[] = [];

    // Generate input based on scenario type
    for (let j = 0; j < scenario.inputSize; j++) {
      // Add randomness based on variance
      const baseValue = Math.random();
      const noise = (Math.random() - 0.5) * variance;
      input.push(Math.max(0, Math.min(1, baseValue + noise)));
    }

    // Generate corresponding target
    switch (scenario.type) {
      case 'maze':
        // For maze: target is direction toward goal
        target.push(...generateMazeTarget(input));
        break;

      case 'pattern':
        // For patterns: classify into categories
        target.push(...generatePatternTarget(input, scenario.outputSize));
        break;

      case 'game':
        // For games: strategic moves
        target.push(...generateGameTarget(input, scenario.outputSize));
        break;

      case 'classification':
        // For classification: one-hot encoding
        target.push(...generateClassificationTarget(input, scenario.outputSize));
        break;

      case 'optimization':
        // For optimization: continuous values
        target.push(...generateOptimizationTarget(input, scenario.outputSize));
        break;

      default:
        // Default: random targets
        for (let k = 0; k < scenario.outputSize; k++) {
          target.push(Math.random());
        }
    }

    data.push({ input, target });
  }

  return data;
};

const generateMazeTarget = (input: number[]): number[] => {
  // Simple heuristic: favor directions with less obstacles
  const directions = input.slice(0, 4);
  const maxIndex = directions.indexOf(Math.max(...directions));

  const target = [0, 0, 0, 0];
  target[maxIndex] = 1;
  return target;
};

const generatePatternTarget = (input: number[], outputSize: number): number[] => {
  // Classify based on input sum
  const sum = input.reduce((a, b) => a + b, 0);
  const category = Math.floor((sum / input.length) * outputSize);
  const clamped = Math.min(category, outputSize - 1);

  const target = Array(outputSize).fill(0);
  target[clamped] = 1;
  return target;
};

const generateGameTarget = (input: number[], outputSize: number): number[] => {
  // Strategic selection based on input patterns
  const weights = input.map((val, idx) => val * (idx + 1));
  const bestMove = weights.indexOf(Math.max(...weights)) % outputSize;

  const target = Array(outputSize).fill(0);
  target[bestMove] = 1;
  return target;
};

const generateClassificationTarget = (input: number[], outputSize: number): number[] => {
  // XOR-like pattern for 2 inputs, generalized for more
  let value = 0;
  input.forEach(val => {
    value += val > 0.5 ? 1 : 0;
  });

  const classIndex = value % outputSize;
  const target = Array(outputSize).fill(0);
  target[classIndex] = 1;
  return target;
};

const generateOptimizationTarget = (input: number[], outputSize: number): number[] => {
  // Continuous optimization: mirror/transform inputs
  const target: number[] = [];
  for (let i = 0; i < outputSize; i++) {
    const idx = i % input.length;
    target.push(1 - input[idx]); // Inverse optimization
  }
  return target;
};

export const initializeTraining = (
  scenario: Scenario,
  architecture: NetworkArchitecture
): TrainingState => {
  // Adjust architecture input/output to match scenario
  const adjustedArch = {
    ...architecture,
    layers: architecture.layers.map((layer, idx) => {
      if (idx === 0) {
        return { ...layer, neurons: scenario.inputSize };
      } else if (idx === architecture.layers.length - 1) {
        return { ...layer, neurons: scenario.outputSize };
      }
      return layer;
    })
  };

  const network = initializeNetwork(adjustedArch);

  // Generate training and validation data
  const allData = generateScenarioData(
    scenario,
    100,
    scenario.initialConditionVariance
  );

  // 80-20 split
  const splitPoint = Math.floor(allData.length * 0.8);
  const trainingData = allData.slice(0, splitPoint);
  const validationData = allData.slice(splitPoint);

  return {
    network,
    episodes: [],
    currentEpisode: 0,
    isTraining: false,
    totalSteps: 0,
    bestAccuracy: 0,
    convergenceScore: 0,
    overfittingRisk: 0,
    trainingData,
    validationData
  };
};

export const runTrainingEpisode = (
  state: TrainingState,
  architecture: NetworkArchitecture,
  scenario: Scenario
): EpisodeResult => {
  let totalLoss = 0;
  let totalReward = 0;
  let correct = 0;

  // Train on all examples
  state.trainingData.forEach(example => {
    const result = trainStep(
      state.network,
      example.input,
      example.target,
      architecture.learningRate,
      architecture
    );

    totalLoss += result.error;

    // Check accuracy
    const predClass = result.output.indexOf(Math.max(...result.output));
    const targetClass = example.target.indexOf(Math.max(...example.target));

    if (predClass === targetClass) {
      correct++;
      totalReward += 1;
    }
  });

  const accuracy = correct / state.trainingData.length;
  const avgLoss = totalLoss / state.trainingData.length;

  return {
    episodeNumber: state.currentEpisode,
    accuracy,
    loss: avgLoss,
    reward: totalReward,
    steps: state.trainingData.length,
    timestamp: Date.now()
  };
};

export const evaluateOnValidation = (
  state: TrainingState,
  architecture: NetworkArchitecture
): { accuracy: number; loss: number } => {
  let correct = 0;
  let totalLoss = 0;

  state.validationData.forEach(example => {
    const output = predict(state.network, example.input, architecture);

    const predClass = output.indexOf(Math.max(...output));
    const targetClass = example.target.indexOf(Math.max(...example.target));

    if (predClass === targetClass) {
      correct++;
    }

    // Calculate loss
    const loss = output.reduce((sum, val, idx) => {
      return sum + Math.pow(val - example.target[idx], 2);
    }, 0) / output.length;

    totalLoss += loss;
  });

  return {
    accuracy: correct / state.validationData.length,
    loss: totalLoss / state.validationData.length
  };
};

export const calculateOverfittingRisk = (
  trainingAccuracy: number,
  validationAccuracy: number
): number => {
  const gap = trainingAccuracy - validationAccuracy;

  // Risk increases with gap
  if (gap < 0.05) return 0.1; // Low risk
  if (gap < 0.15) return 0.3; // Moderate risk
  if (gap < 0.25) return 0.6; // High risk
  return 0.9; // Very high risk
};

export const calculateConvergence = (episodes: EpisodeResult[], window: number = 10): number => {
  if (episodes.length < window) return 0;

  const recent = episodes.slice(-window);
  const accuracies = recent.map(e => e.accuracy);

  // Calculate variance
  const mean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  const variance = accuracies.reduce((sum, val) => {
    return sum + Math.pow(val - mean, 2);
  }, 0) / accuracies.length;

  // Lower variance = higher convergence
  const convergence = 1 - Math.min(variance * 10, 1);

  return convergence;
};

export const simulateAIBattle = (
  network1: NetworkState,
  network2: NetworkState,
  architecture: NetworkArchitecture,
  scenario: Scenario,
  rounds: number = 10
): { winner: 1 | 2 | 'tie'; scores: [number, number]; details: string } => {
  const testData = generateScenarioData(scenario, rounds, 0.1);

  let score1 = 0;
  let score2 = 0;

  testData.forEach(example => {
    const output1 = predict(network1, example.input, architecture);
    const output2 = predict(network2, example.input, architecture);

    // Calculate performance
    const loss1 = output1.reduce((sum, val, idx) => {
      return sum + Math.pow(val - example.target[idx], 2);
    }, 0);

    const loss2 = output2.reduce((sum, val, idx) => {
      return sum + Math.pow(val - example.target[idx], 2);
    }, 0);

    // Lower loss wins
    if (loss1 < loss2) {
      score1++;
    } else if (loss2 < loss1) {
      score2++;
    }
  });

  let winner: 1 | 2 | 'tie';
  if (score1 > score2) {
    winner = 1;
  } else if (score2 > score1) {
    winner = 2;
  } else {
    winner = 'tie';
  }

  return {
    winner,
    scores: [score1, score2],
    details: `AI 1 scored ${score1}/${rounds}, AI 2 scored ${score2}/${rounds}`
  };
};

export const transferLearning = (
  sourceNetwork: NetworkState,
  targetArchitecture: NetworkArchitecture,
  freezeLayers: number = 1
): NetworkState => {
  // Clone source network
  const newNetwork = initializeNetwork(targetArchitecture);

  // Transfer weights from compatible layers
  sourceNetwork.connections.forEach(conn => {
    const matching = newNetwork.connections.find(c =>
      c.fromNeuronId === conn.fromNeuronId && c.toNeuronId === conn.toNeuronId
    );

    if (matching) {
      matching.weight = conn.weight;
    }
  });

  // Transfer biases
  sourceNetwork.neurons.forEach((neuron, id) => {
    const matching = newNetwork.neurons.get(id);
    if (matching) {
      matching.bias = neuron.bias;
    }
  });

  return newNetwork;
};
