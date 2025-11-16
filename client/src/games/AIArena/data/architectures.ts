export type ActivationFunction = 'relu' | 'sigmoid' | 'tanh' | 'linear' | 'leaky_relu';

export interface LayerConfig {
  id: string;
  type: 'input' | 'hidden' | 'output';
  neurons: number;
  activation: ActivationFunction;
}

export interface NetworkArchitecture {
  id: string;
  name: string;
  description: string;
  layers: LayerConfig[];
  learningRate: number;
  color: string;
  bestFor: string[];
  complexity: 'simple' | 'moderate' | 'complex';
}

export const activationFunctions: Record<ActivationFunction, {
  name: string;
  description: string;
  color: string;
  formula: string;
}> = {
  relu: {
    name: 'ReLU',
    description: 'Fast, effective for deep networks',
    color: '#10B981',
    formula: 'f(x) = max(0, x)'
  },
  sigmoid: {
    name: 'Sigmoid',
    description: 'Outputs between 0-1, good for probabilities',
    color: '#3B82F6',
    formula: 'f(x) = 1/(1 + e^-x)'
  },
  tanh: {
    name: 'Tanh',
    description: 'Outputs between -1 and 1, zero-centered',
    color: '#8B5CF6',
    formula: 'f(x) = (e^x - e^-x)/(e^x + e^-x)'
  },
  linear: {
    name: 'Linear',
    description: 'No transformation, for regression',
    color: '#6B7280',
    formula: 'f(x) = x'
  },
  leaky_relu: {
    name: 'Leaky ReLU',
    description: 'ReLU variant that prevents dying neurons',
    color: '#059669',
    formula: 'f(x) = max(0.01x, x)'
  }
};

export const presetArchitectures: NetworkArchitecture[] = [
  {
    id: 'shallow',
    name: 'Shallow Network',
    description: 'Single hidden layer - simple and fast',
    layers: [
      { id: 'input', type: 'input', neurons: 4, activation: 'linear' },
      { id: 'hidden1', type: 'hidden', neurons: 8, activation: 'relu' },
      { id: 'output', type: 'output', neurons: 4, activation: 'sigmoid' }
    ],
    learningRate: 0.01,
    color: '#10B981',
    bestFor: ['Simple patterns', 'Linear problems'],
    complexity: 'simple'
  },
  {
    id: 'standard',
    name: 'Standard Network',
    description: 'Two hidden layers - balanced performance',
    layers: [
      { id: 'input', type: 'input', neurons: 4, activation: 'linear' },
      { id: 'hidden1', type: 'hidden', neurons: 16, activation: 'relu' },
      { id: 'hidden2', type: 'hidden', neurons: 8, activation: 'relu' },
      { id: 'output', type: 'output', neurons: 4, activation: 'sigmoid' }
    ],
    learningRate: 0.005,
    color: '#3B82F6',
    bestFor: ['Most tasks', 'General purpose'],
    complexity: 'moderate'
  },
  {
    id: 'deep',
    name: 'Deep Network',
    description: 'Three hidden layers - maximum capacity',
    layers: [
      { id: 'input', type: 'input', neurons: 4, activation: 'linear' },
      { id: 'hidden1', type: 'hidden', neurons: 24, activation: 'relu' },
      { id: 'hidden2', type: 'hidden', neurons: 16, activation: 'relu' },
      { id: 'hidden3', type: 'hidden', neurons: 8, activation: 'relu' },
      { id: 'output', type: 'output', neurons: 4, activation: 'sigmoid' }
    ],
    learningRate: 0.001,
    color: '#8B5CF6',
    bestFor: ['Complex patterns', 'Large datasets'],
    complexity: 'complex'
  },
  {
    id: 'wide',
    name: 'Wide Network',
    description: 'Few layers but many neurons per layer',
    layers: [
      { id: 'input', type: 'input', neurons: 4, activation: 'linear' },
      { id: 'hidden1', type: 'hidden', neurons: 32, activation: 'relu' },
      { id: 'output', type: 'output', neurons: 4, activation: 'sigmoid' }
    ],
    learningRate: 0.008,
    color: '#F59E0B',
    bestFor: ['Feature-rich data', 'Memorization'],
    complexity: 'moderate'
  },
  {
    id: 'narrow_deep',
    name: 'Narrow Deep',
    description: 'Many layers with fewer neurons each',
    layers: [
      { id: 'input', type: 'input', neurons: 4, activation: 'linear' },
      { id: 'hidden1', type: 'hidden', neurons: 8, activation: 'relu' },
      { id: 'hidden2', type: 'hidden', neurons: 6, activation: 'relu' },
      { id: 'hidden3', type: 'hidden', neurons: 6, activation: 'tanh' },
      { id: 'hidden4', type: 'hidden', neurons: 4, activation: 'relu' },
      { id: 'output', type: 'output', neurons: 4, activation: 'sigmoid' }
    ],
    learningRate: 0.002,
    color: '#EC4899',
    bestFor: ['Hierarchical features', 'Compression'],
    complexity: 'complex'
  }
];

export const hyperparameters = {
  learningRate: {
    min: 0.0001,
    max: 0.1,
    default: 0.01,
    step: 0.0001,
    description: 'How fast the network learns'
  },
  batchSize: {
    min: 1,
    max: 64,
    default: 16,
    step: 1,
    description: 'Number of samples per training step'
  },
  momentum: {
    min: 0,
    max: 0.99,
    default: 0.9,
    step: 0.01,
    description: 'Helps accelerate training'
  },
  dropout: {
    min: 0,
    max: 0.8,
    default: 0.2,
    step: 0.05,
    description: 'Prevents overfitting by randomly dropping neurons'
  }
};

export const getArchitectureById = (id: string): NetworkArchitecture | undefined => {
  return presetArchitectures.find(arch => arch.id === id);
};

export const createCustomArchitecture = (
  inputSize: number,
  outputSize: number,
  hiddenLayers: number[],
  activation: ActivationFunction = 'relu',
  learningRate: number = 0.01
): NetworkArchitecture => {
  const layers: LayerConfig[] = [
    { id: 'input', type: 'input', neurons: inputSize, activation: 'linear' }
  ];

  hiddenLayers.forEach((neurons, i) => {
    layers.push({
      id: `hidden${i + 1}`,
      type: 'hidden',
      neurons,
      activation
    });
  });

  layers.push({
    id: 'output',
    type: 'output',
    neurons: outputSize,
    activation: 'sigmoid'
  });

  return {
    id: 'custom',
    name: 'Custom Architecture',
    description: 'User-designed network',
    layers,
    learningRate,
    color: '#6366F1',
    bestFor: ['Custom tasks'],
    complexity: hiddenLayers.length > 2 ? 'complex' : 'moderate'
  };
};
