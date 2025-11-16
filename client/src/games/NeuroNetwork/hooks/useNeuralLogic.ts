import { useState, useEffect, useCallback, useRef } from 'react';
import { Level, Neuron, Synapse, NeurotransmitterType } from '../data/levels';
import { NeuralEngine, GameState } from '../utils/neuralEngine';
import { Pathfinder } from '../utils/pathfinding';

export interface UseNeuralLogicReturn {
  gameState: GameState | null;
  playerSynapses: Synapse[];
  isRunning: boolean;
  isComplete: boolean;
  constraintsMet: boolean;
  violations: string[];
  score: number;
  addSynapse: (from: string, to: string, neurotransmitter?: NeurotransmitterType) => boolean;
  removeSynapse: (synapseId: string) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  activateInputNeuron: (neuronId: string) => void;
  getSuggestedConnections: (neuronId: string) => string[];
  hasValidPath: () => boolean;
}

export function useNeuralLogic(level: Level): UseNeuralLogicReturn {
  const [playerSynapses, setPlayerSynapses] = useState<Synapse[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [constraintsMet, setConstraintsMet] = useState(true);
  const [violations, setViolations] = useState<string[]>([]);

  const engineRef = useRef<NeuralEngine | null>(null);
  const pathfinderRef = useRef<Pathfinder | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const synapseIdCounterRef = useRef(0);

  // Initialize engine and pathfinder
  useEffect(() => {
    const allSynapses = [...level.existingSynapses, ...playerSynapses];
    engineRef.current = new NeuralEngine(level.neurons, allSynapses);
    pathfinderRef.current = new Pathfinder(level.neurons, allSynapses);

    setGameState(engineRef.current.getState());
  }, [level, playerSynapses]);

  // Animation loop
  useEffect(() => {
    if (!isRunning || !engineRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = now;

      if (engineRef.current) {
        const newState = engineRef.current.update(deltaTime);
        setGameState(newState);

        // Check if level is complete
        if (newState.completed && !isComplete) {
          checkLevelCompletion();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, isComplete]);

  // Check constraints whenever synapses change
  useEffect(() => {
    if (engineRef.current) {
      const result = engineRef.current.checkConstraints(
        level.constraints,
        playerSynapses
      );
      setConstraintsMet(result.met);
      setViolations(result.violations);
    }
  }, [playerSynapses, level.constraints]);

  const addSynapse = useCallback(
    (from: string, to: string, neurotransmitter?: NeurotransmitterType): boolean => {
      // Check if max synapses reached
      if (
        level.constraints.maxSynapses &&
        playerSynapses.length >= level.constraints.maxSynapses
      ) {
        return false;
      }

      // Check if synapse already exists
      const exists = playerSynapses.some(s => s.from === from && s.to === to);
      if (exists) return false;

      // Check if would create cycle (optional - can be allowed for feedback loops)
      // if (pathfinderRef.current?.wouldCreateCycle(from, to)) {
      //   return false;
      // }

      const newSynapse: Synapse = {
        id: `player_synapse_${synapseIdCounterRef.current++}`,
        from,
        to,
        weight: 1,
        neurotransmitter
      };

      setPlayerSynapses(prev => [...prev, newSynapse]);

      // Update pathfinder
      if (pathfinderRef.current) {
        const allSynapses = [...level.existingSynapses, ...playerSynapses, newSynapse];
        pathfinderRef.current.updateSynapses(allSynapses);
      }

      // Update engine
      if (engineRef.current) {
        engineRef.current.addSynapse(newSynapse);
      }

      return true;
    },
    [playerSynapses, level.existingSynapses, level.constraints.maxSynapses]
  );

  const removeSynapse = useCallback(
    (synapseId: string) => {
      setPlayerSynapses(prev => prev.filter(s => s.id !== synapseId));

      // Update engine
      if (engineRef.current) {
        engineRef.current.removeSynapse(synapseId);
      }

      // Update pathfinder
      if (pathfinderRef.current) {
        const allSynapses = [...level.existingSynapses, ...playerSynapses.filter(s => s.id !== synapseId)];
        pathfinderRef.current.updateSynapses(allSynapses);
      }
    },
    [playerSynapses, level.existingSynapses]
  );

  const startSimulation = useCallback(() => {
    setIsRunning(true);
    lastUpdateTimeRef.current = Date.now();
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setIsComplete(false);

    if (engineRef.current) {
      engineRef.current.reset();
      setGameState(engineRef.current.getState());
    }

    lastUpdateTimeRef.current = Date.now();
  }, []);

  const activateInputNeuron = useCallback((neuronId: string) => {
    if (engineRef.current) {
      engineRef.current.activateInputNeuron(neuronId);
    }
  }, []);

  const getSuggestedConnections = useCallback((neuronId: string): string[] => {
    if (pathfinderRef.current) {
      return pathfinderRef.current.getSuggestedConnections(neuronId, 3);
    }
    return [];
  }, []);

  const hasValidPath = useCallback((): boolean => {
    if (pathfinderRef.current) {
      return pathfinderRef.current.hasValidPath();
    }
    return false;
  }, []);

  const checkLevelCompletion = useCallback(() => {
    if (!engineRef.current) return;

    const result = engineRef.current.checkConstraints(
      level.constraints,
      playerSynapses
    );

    if (result.met && gameState?.completed) {
      setIsComplete(true);
      setIsRunning(false);
    }
  }, [level.constraints, playerSynapses, gameState?.completed]);

  return {
    gameState,
    playerSynapses,
    isRunning,
    isComplete,
    constraintsMet,
    violations,
    score: gameState?.score || 0,
    addSynapse,
    removeSynapse,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    activateInputNeuron,
    getSuggestedConnections,
    hasValidPath
  };
}
