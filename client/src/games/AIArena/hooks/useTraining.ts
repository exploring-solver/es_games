import { useState, useCallback, useEffect } from 'react';
import { NetworkState, Neuron, Connection } from '../utils/neuralNetSimulator';

export interface VisualNeuron extends Neuron {
  x: number;
  y: number;
  radius: number;
  isActive: boolean;
  pulseIntensity: number;
}

export interface VisualConnection extends Connection {
  isActive: boolean;
  flowIntensity: number;
}

export interface NetworkVisualization {
  neurons: VisualNeuron[];
  connections: VisualConnection[];
  layers: { id: string; neurons: VisualNeuron[] }[];
}

export const useTraining = () => {
  const [visualization, setVisualization] = useState<NetworkVisualization>({
    neurons: [],
    connections: [],
    layers: []
  });

  const [animatedNeurons, setAnimatedNeurons] = useState<Set<string>>(new Set());
  const [animatedConnections, setAnimatedConnections] = useState<Set<string>>(new Set());

  // Create visualization from network state
  const createVisualization = useCallback((
    network: NetworkState,
    width: number = 800,
    height: number = 600
  ): NetworkVisualization => {
    const layers: { id: string; neurons: VisualNeuron[] }[] = [];
    const neurons: VisualNeuron[] = [];
    const connections: VisualConnection[] = [];

    const layerCount = network.layers.length;
    const layerSpacing = width / (layerCount + 1);

    // Create visual neurons
    network.layers.forEach((layerId, layerIdx) => {
      const layerNeurons: VisualNeuron[] = [];
      const neuronsInLayer: Neuron[] = [];

      network.neurons.forEach(neuron => {
        if (neuron.layerId === layerId) {
          neuronsInLayer.push(neuron);
        }
      });

      const neuronCount = neuronsInLayer.length;
      const verticalSpacing = height / (neuronCount + 1);

      neuronsInLayer.forEach((neuron, neuronIdx) => {
        const x = layerSpacing * (layerIdx + 1);
        const y = verticalSpacing * (neuronIdx + 1);

        const visualNeuron: VisualNeuron = {
          ...neuron,
          x,
          y,
          radius: 20,
          isActive: Math.abs(neuron.activation) > 0.5,
          pulseIntensity: Math.abs(neuron.activation)
        };

        layerNeurons.push(visualNeuron);
        neurons.push(visualNeuron);
      });

      layers.push({ id: layerId, neurons: layerNeurons });
    });

    // Create visual connections
    network.connections.forEach(conn => {
      const visualConn: VisualConnection = {
        ...conn,
        isActive: Math.abs(conn.weight) > 0.5,
        flowIntensity: Math.abs(conn.weight)
      };

      connections.push(visualConn);
    });

    return { neurons, connections, layers };
  }, []);

  const updateVisualization = useCallback((network: NetworkState | null) => {
    if (!network) {
      setVisualization({ neurons: [], connections: [], layers: [] });
      return;
    }

    const vis = createVisualization(network);
    setVisualization(vis);
  }, [createVisualization]);

  // Animate neuron activation
  const animateNeuron = useCallback((neuronId: string, duration: number = 500) => {
    setAnimatedNeurons(prev => new Set(prev).add(neuronId));

    setTimeout(() => {
      setAnimatedNeurons(prev => {
        const next = new Set(prev);
        next.delete(neuronId);
        return next;
      });
    }, duration);
  }, []);

  // Animate connection signal flow
  const animateConnection = useCallback((connectionId: string, duration: number = 300) => {
    setAnimatedConnections(prev => new Set(prev).add(connectionId));

    setTimeout(() => {
      setAnimatedConnections(prev => {
        const next = new Set(prev);
        next.delete(connectionId);
        return next;
      });
    }, duration);
  }, []);

  // Animate forward pass
  const animateForwardPass = useCallback((network: NetworkState) => {
    network.layers.forEach((layerId, layerIdx) => {
      setTimeout(() => {
        network.neurons.forEach(neuron => {
          if (neuron.layerId === layerId && neuron.activation > 0.1) {
            animateNeuron(neuron.id);
          }
        });

        // Animate connections to next layer
        if (layerIdx < network.layers.length - 1) {
          network.connections.forEach(conn => {
            const fromNeuron = network.neurons.get(conn.fromNeuronId);
            if (fromNeuron && fromNeuron.layerId === layerId) {
              setTimeout(() => {
                animateConnection(conn.id);
              }, 100);
            }
          });
        }
      }, layerIdx * 200);
    });
  }, [animateNeuron, animateConnection]);

  return {
    visualization,
    animatedNeurons,
    animatedConnections,
    updateVisualization,
    animateNeuron,
    animateConnection,
    animateForwardPass
  };
};

// Hook for managing hyperparameters
export const useHyperparameters = () => {
  const [learningRate, setLearningRate] = useState(0.01);
  const [batchSize, setBatchSize] = useState(16);
  const [momentum, setMomentum] = useState(0.9);
  const [dropout, setDropout] = useState(0.2);

  const resetToDefaults = useCallback(() => {
    setLearningRate(0.01);
    setBatchSize(16);
    setMomentum(0.9);
    setDropout(0.2);
  }, []);

  return {
    learningRate,
    setLearningRate,
    batchSize,
    setBatchSize,
    momentum,
    setMomentum,
    dropout,
    setDropout,
    resetToDefaults
  };
};

// Hook for tournament mode
export const useTournament = () => {
  const [participants, setParticipants] = useState<{
    id: string;
    name: string;
    network: NetworkState;
    score: number;
  }[]>([]);

  const [currentMatch, setCurrentMatch] = useState<{
    participant1: number;
    participant2: number;
    round: number;
  } | null>(null);

  const [bracket, setBracket] = useState<number[][]>([]);
  const [isActive, setIsActive] = useState(false);

  const addParticipant = useCallback((
    id: string,
    name: string,
    network: NetworkState
  ) => {
    setParticipants(prev => [...prev, { id, name, network, score: 0 }]);
  }, []);

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  }, []);

  const startTournament = useCallback(() => {
    if (participants.length < 2) return;

    // Create bracket
    const rounds: number[][] = [];
    const indices = participants.map((_, i) => i);

    // Round-robin or elimination based on participant count
    if (participants.length <= 4) {
      // Round-robin for small tournaments
      for (let i = 0; i < indices.length; i++) {
        for (let j = i + 1; j < indices.length; j++) {
          rounds.push([i, j]);
        }
      }
    } else {
      // Single elimination for larger tournaments
      for (let i = 0; i < indices.length; i += 2) {
        if (i + 1 < indices.length) {
          rounds.push([i, i + 1]);
        }
      }
    }

    setBracket(rounds);
    setCurrentMatch({ participant1: rounds[0][0], participant2: rounds[0][1], round: 0 });
    setIsActive(true);
  }, [participants]);

  const recordMatchResult = useCallback((winnerId: string) => {
    setParticipants(prev => prev.map(p =>
      p.id === winnerId ? { ...p, score: p.score + 1 } : p
    ));

    setCurrentMatch(prev => {
      if (!prev || prev.round >= bracket.length - 1) {
        setIsActive(false);
        return null;
      }

      const nextRound = prev.round + 1;
      const nextMatch = bracket[nextRound];

      return {
        participant1: nextMatch[0],
        participant2: nextMatch[1],
        round: nextRound
      };
    });
  }, [bracket]);

  const resetTournament = useCallback(() => {
    setParticipants(prev => prev.map(p => ({ ...p, score: 0 })));
    setBracket([]);
    setCurrentMatch(null);
    setIsActive(false);
  }, []);

  return {
    participants,
    currentMatch,
    bracket,
    isActive,
    addParticipant,
    removeParticipant,
    startTournament,
    recordMatchResult,
    resetTournament
  };
};
