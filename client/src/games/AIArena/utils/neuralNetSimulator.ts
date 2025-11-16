import { ActivationFunction, LayerConfig, NetworkArchitecture } from '../data/architectures';

export interface Neuron {
  id: string;
  layerId: string;
  value: number;
  bias: number;
  activation: number;
  delta: number; // for backpropagation
}

export interface Connection {
  id: string;
  fromNeuronId: string;
  toNeuronId: string;
  weight: number;
  gradient: number;
}

export interface NetworkState {
  neurons: Map<string, Neuron>;
  connections: Connection[];
  layers: string[];
  activations: Map<string, number[]>; // layer -> activations
}

// Activation functions
const activationFn = {
  relu: (x: number) => Math.max(0, x),
  sigmoid: (x: number) => 1 / (1 + Math.exp(-x)),
  tanh: (x: number) => Math.tanh(x),
  linear: (x: number) => x,
  leaky_relu: (x: number) => x > 0 ? x : 0.01 * x
};

// Derivatives for backpropagation
const activationDerivative = {
  relu: (x: number) => x > 0 ? 1 : 0,
  sigmoid: (x: number) => {
    const sig = activationFn.sigmoid(x);
    return sig * (1 - sig);
  },
  tanh: (x: number) => 1 - Math.pow(Math.tanh(x), 2),
  linear: (_x: number) => 1,
  leaky_relu: (x: number) => x > 0 ? 1 : 0.01
};

export const initializeNetwork = (architecture: NetworkArchitecture): NetworkState => {
  const neurons = new Map<string, Neuron>();
  const connections: Connection[] = [];
  const layers: string[] = [];

  // Create neurons for each layer
  architecture.layers.forEach((layer, layerIndex) => {
    layers.push(layer.id);

    for (let i = 0; i < layer.neurons; i++) {
      const neuronId = `${layer.id}_${i}`;
      neurons.set(neuronId, {
        id: neuronId,
        layerId: layer.id,
        value: 0,
        bias: (Math.random() - 0.5) * 0.1, // small random bias
        activation: 0,
        delta: 0
      });
    }

    // Create connections to previous layer
    if (layerIndex > 0) {
      const prevLayer = architecture.layers[layerIndex - 1];

      for (let i = 0; i < layer.neurons; i++) {
        const toNeuronId = `${layer.id}_${i}`;

        for (let j = 0; j < prevLayer.neurons; j++) {
          const fromNeuronId = `${prevLayer.id}_${j}`;

          // Xavier/He initialization
          const fanIn = prevLayer.neurons;
          const fanOut = layer.neurons;
          const limit = Math.sqrt(6 / (fanIn + fanOut));

          connections.push({
            id: `${fromNeuronId}_${toNeuronId}`,
            fromNeuronId,
            toNeuronId,
            weight: (Math.random() - 0.5) * 2 * limit,
            gradient: 0
          });
        }
      }
    }
  });

  return {
    neurons,
    connections,
    layers,
    activations: new Map()
  };
};

export const forwardPass = (
  network: NetworkState,
  input: number[],
  architecture: NetworkArchitecture
): number[] => {
  const { neurons, connections, layers } = network;

  // Set input layer values
  const inputLayer = architecture.layers[0];
  input.forEach((value, i) => {
    const neuronId = `${inputLayer.id}_${i}`;
    const neuron = neurons.get(neuronId);
    if (neuron) {
      neuron.value = value;
      neuron.activation = value;
    }
  });

  // Process each layer after input
  for (let layerIdx = 1; layerIdx < architecture.layers.length; layerIdx++) {
    const layer = architecture.layers[layerIdx];
    const activations: number[] = [];

    // For each neuron in this layer
    for (let i = 0; i < layer.neurons; i++) {
      const neuronId = `${layer.id}_${i}`;
      const neuron = neurons.get(neuronId)!;

      // Calculate weighted sum
      let sum = neuron.bias;

      connections.forEach(conn => {
        if (conn.toNeuronId === neuronId) {
          const fromNeuron = neurons.get(conn.fromNeuronId)!;
          sum += fromNeuron.activation * conn.weight;
        }
      });

      neuron.value = sum;
      neuron.activation = activationFn[layer.activation](sum);
      activations.push(neuron.activation);
    }

    network.activations.set(layer.id, activations);
  }

  // Return output layer activations
  const outputLayer = architecture.layers[architecture.layers.length - 1];
  return network.activations.get(outputLayer.id) || [];
};

export const backwardPass = (
  network: NetworkState,
  target: number[],
  learningRate: number,
  architecture: NetworkArchitecture
): number => {
  const { neurons, connections } = network;

  // Calculate output layer deltas
  const outputLayer = architecture.layers[architecture.layers.length - 1];
  let totalError = 0;

  for (let i = 0; i < outputLayer.neurons; i++) {
    const neuronId = `${outputLayer.id}_${i}`;
    const neuron = neurons.get(neuronId)!;

    const error = target[i] - neuron.activation;
    totalError += Math.abs(error);

    const derivative = activationDerivative[outputLayer.activation](neuron.value);
    neuron.delta = error * derivative;
  }

  // Backpropagate through hidden layers
  for (let layerIdx = architecture.layers.length - 2; layerIdx >= 0; layerIdx--) {
    const layer = architecture.layers[layerIdx];

    for (let i = 0; i < layer.neurons; i++) {
      const neuronId = `${layer.id}_${i}`;
      const neuron = neurons.get(neuronId)!;

      let error = 0;
      connections.forEach(conn => {
        if (conn.fromNeuronId === neuronId) {
          const toNeuron = neurons.get(conn.toNeuronId)!;
          error += toNeuron.delta * conn.weight;
        }
      });

      const derivative = activationDerivative[layer.activation](neuron.value);
      neuron.delta = error * derivative;
    }
  }

  // Update weights and biases
  connections.forEach(conn => {
    const fromNeuron = neurons.get(conn.fromNeuronId)!;
    const toNeuron = neurons.get(conn.toNeuronId)!;

    const gradient = fromNeuron.activation * toNeuron.delta;
    conn.gradient = gradient;
    conn.weight += learningRate * gradient;
  });

  // Update biases
  neurons.forEach(neuron => {
    if (neuron.layerId !== 'input') {
      neuron.bias += learningRate * neuron.delta;
    }
  });

  return totalError;
};

export const trainStep = (
  network: NetworkState,
  input: number[],
  target: number[],
  learningRate: number,
  architecture: NetworkArchitecture
): { output: number[]; error: number } => {
  const output = forwardPass(network, input, architecture);
  const error = backwardPass(network, target, learningRate, architecture);

  return { output, error };
};

export const predict = (
  network: NetworkState,
  input: number[],
  architecture: NetworkArchitecture
): number[] => {
  return forwardPass(network, input, architecture);
};

export const calculateAccuracy = (predictions: number[][], targets: number[][]): number => {
  if (predictions.length === 0) return 0;

  let correct = 0;
  predictions.forEach((pred, i) => {
    const target = targets[i];

    // For classification: check if max index matches
    const predClass = pred.indexOf(Math.max(...pred));
    const targetClass = target.indexOf(Math.max(...target));

    if (predClass === targetClass) {
      correct++;
    }
  });

  return correct / predictions.length;
};

export const calculateLoss = (predictions: number[][], targets: number[][]): number => {
  if (predictions.length === 0) return 0;

  let totalLoss = 0;
  predictions.forEach((pred, i) => {
    const target = targets[i];

    // Mean Squared Error
    const mse = pred.reduce((sum, val, j) => {
      return sum + Math.pow(val - target[j], 2);
    }, 0) / pred.length;

    totalLoss += mse;
  });

  return totalLoss / predictions.length;
};

export const getNetworkComplexity = (architecture: NetworkArchitecture): number => {
  let totalParams = 0;

  for (let i = 1; i < architecture.layers.length; i++) {
    const prevLayer = architecture.layers[i - 1];
    const currLayer = architecture.layers[i];

    // Weights + biases
    totalParams += (prevLayer.neurons * currLayer.neurons) + currLayer.neurons;
  }

  return totalParams;
};

export const cloneNetwork = (network: NetworkState): NetworkState => {
  const neurons = new Map<string, Neuron>();
  network.neurons.forEach((neuron, id) => {
    neurons.set(id, { ...neuron });
  });

  const connections = network.connections.map(conn => ({ ...conn }));
  const activations = new Map(network.activations);

  return {
    neurons,
    connections,
    layers: [...network.layers],
    activations
  };
};
