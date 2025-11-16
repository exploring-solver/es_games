import { useState, useCallback, useRef, useEffect } from 'react';
import { Scenario } from '../data/scenarios';
import { NetworkArchitecture } from '../data/architectures';
import { NetworkState } from '../utils/neuralNetSimulator';
import {
  TrainingState,
  EpisodeResult,
  initializeTraining,
  runTrainingEpisode,
  evaluateOnValidation,
  calculateOverfittingRisk,
  calculateConvergence
} from '../utils/mlEngine';

export interface MLSimulationState {
  trainingState: TrainingState | null;
  isRunning: boolean;
  currentEpisode: number;
  maxEpisodes: number;
  progress: number;
  validationAccuracy: number;
  overfittingRisk: number;
  convergenceScore: number;
  isComplete: boolean;
  targetReached: boolean;
}

export const useMLSimulation = (
  scenario: Scenario | null,
  architecture: NetworkArchitecture | null
) => {
  const [state, setState] = useState<MLSimulationState>({
    trainingState: null,
    isRunning: false,
    currentEpisode: 0,
    maxEpisodes: 0,
    progress: 0,
    validationAccuracy: 0,
    overfittingRisk: 0,
    convergenceScore: 0,
    isComplete: false,
    targetReached: false
  });

  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Initialize training
  const initializeSimulation = useCallback(() => {
    if (!scenario || !architecture) return;

    const trainingState = initializeTraining(scenario, architecture);

    setState({
      trainingState,
      isRunning: false,
      currentEpisode: 0,
      maxEpisodes: scenario.maxEpisodes,
      progress: 0,
      validationAccuracy: 0,
      overfittingRisk: 0,
      convergenceScore: 0,
      isComplete: false,
      targetReached: false
    });
  }, [scenario, architecture]);

  // Run training step
  const trainingLoop = useCallback(() => {
    setState(prev => {
      if (!prev.trainingState || !prev.isRunning || !scenario || !architecture) {
        return prev;
      }

      if (prev.currentEpisode >= prev.maxEpisodes) {
        return { ...prev, isRunning: false, isComplete: true };
      }

      // Run episode
      const episodeResult = runTrainingEpisode(
        prev.trainingState,
        architecture,
        scenario
      );

      prev.trainingState.episodes.push(episodeResult);
      prev.trainingState.currentEpisode = prev.currentEpisode + 1;
      prev.trainingState.totalSteps += episodeResult.steps;

      // Update best accuracy
      if (episodeResult.accuracy > prev.trainingState.bestAccuracy) {
        prev.trainingState.bestAccuracy = episodeResult.accuracy;
      }

      // Evaluate on validation set every 5 episodes
      let validationAccuracy = prev.validationAccuracy;
      let overfittingRisk = prev.overfittingRisk;

      if (prev.currentEpisode % 5 === 0) {
        const validation = evaluateOnValidation(prev.trainingState, architecture);
        validationAccuracy = validation.accuracy;
        overfittingRisk = calculateOverfittingRisk(
          episodeResult.accuracy,
          validationAccuracy
        );
      }

      // Calculate convergence
      const convergenceScore = calculateConvergence(prev.trainingState.episodes);
      prev.trainingState.convergenceScore = convergenceScore;
      prev.trainingState.overfittingRisk = overfittingRisk;

      const progress = prev.currentEpisode / prev.maxEpisodes;
      const targetReached = episodeResult.accuracy >= scenario.targetAccuracy;

      return {
        ...prev,
        currentEpisode: prev.currentEpisode + 1,
        progress,
        validationAccuracy,
        overfittingRisk,
        convergenceScore,
        targetReached,
        isComplete: prev.currentEpisode + 1 >= prev.maxEpisodes || targetReached
      };
    });
  }, [scenario, architecture]);

  // Animation loop for smooth updates
  useEffect(() => {
    if (!state.isRunning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      // Update at ~10 FPS for training
      if (timestamp - lastUpdateRef.current > 100) {
        trainingLoop();
        lastUpdateRef.current = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isRunning, trainingLoop]);

  const startTraining = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pauseTraining = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetTraining = useCallback(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  const getNetwork = useCallback((): NetworkState | null => {
    return state.trainingState?.network || null;
  }, [state.trainingState]);

  const getEpisodes = useCallback((): EpisodeResult[] => {
    return state.trainingState?.episodes || [];
  }, [state.trainingState]);

  const getCurrentAccuracy = useCallback((): number => {
    const episodes = state.trainingState?.episodes || [];
    if (episodes.length === 0) return 0;
    return episodes[episodes.length - 1].accuracy;
  }, [state.trainingState]);

  const getCurrentLoss = useCallback((): number => {
    const episodes = state.trainingState?.episodes || [];
    if (episodes.length === 0) return 0;
    return episodes[episodes.length - 1].loss;
  }, [state.trainingState]);

  return {
    ...state,
    initializeSimulation,
    startTraining,
    pauseTraining,
    resetTraining,
    getNetwork,
    getEpisodes,
    getCurrentAccuracy,
    getCurrentLoss
  };
};
