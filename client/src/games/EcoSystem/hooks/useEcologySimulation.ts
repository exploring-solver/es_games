import { useState, useCallback, useEffect, useRef } from 'react';
import { Biome } from '../data/biomes';
import {
  GameState,
  initializeGame,
  processSeasonTick,
  introduceSpecies,
  removeSpecies,
  getSpeciesAtRisk,
  SeasonResult
} from '../utils/ecologyEngine';

export interface SimulationControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
  speedUp: () => void;
  slowDown: () => void;
  addSpecies: (speciesId: string) => void;
  removeSpeciesById: (speciesId: string) => void;
  skipSeason: () => void;
}

export interface SimulationState {
  gameState: GameState;
  isRunning: boolean;
  speed: number; // Milliseconds per season
  lastResult: SeasonResult | null;
  speciesAtRisk: Array<{ species: any; population: number; risk: string }>;
}

const SPEED_LEVELS = [3000, 2000, 1000, 500, 250]; // ms per tick
const DEFAULT_SPEED_INDEX = 2;

export const useEcologySimulation = (
  initialBiome: Biome,
  gameMode: 'competitive' | 'coop' | 'sandbox'
) => {
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGame(initialBiome, gameMode)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(DEFAULT_SPEED_INDEX);
  const [lastResult, setLastResult] = useState<SeasonResult | null>(null);
  const [speciesAtRisk, setSpeciesAtRisk] = useState<Array<{ species: any; population: number; risk: string }>>([]);

  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Process one season tick
  const tick = useCallback(() => {
    setGameState(currentState => {
      if (currentState.isGameOver) {
        setIsRunning(false);
        return currentState;
      }

      const result = processSeasonTick(currentState);
      setLastResult(result);

      // Update species at risk
      setSpeciesAtRisk(getSpeciesAtRisk(result.newState));

      return result.newState;
    });
  }, []);

  // Start simulation
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Pause simulation
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset game
  const reset = useCallback(() => {
    setIsRunning(false);
    setGameState(initializeGame(initialBiome, gameMode));
    setLastResult(null);
    setSpeciesAtRisk([]);
  }, [initialBiome, gameMode]);

  // Speed up
  const speedUp = useCallback(() => {
    setSpeedIndex(prev => Math.min(prev + 1, SPEED_LEVELS.length - 1));
  }, []);

  // Slow down
  const slowDown = useCallback(() => {
    setSpeedIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // Add species
  const addSpecies = useCallback((speciesId: string) => {
    const result = introduceSpecies(gameState, speciesId);
    if (result.success && result.newState) {
      setGameState(result.newState);
    }
    return result;
  }, [gameState]);

  // Remove species
  const removeSpeciesById = useCallback((speciesId: string) => {
    const result = removeSpecies(gameState, speciesId);
    if (result.success && result.newState) {
      setGameState(result.newState);
    }
    return result;
  }, [gameState]);

  // Skip one season (manual tick)
  const skipSeason = useCallback(() => {
    tick();
  }, [tick]);

  // Handle automatic ticking
  useEffect(() => {
    if (isRunning && !gameState.isGameOver) {
      tickIntervalRef.current = setInterval(() => {
        tick();
      }, SPEED_LEVELS[speedIndex]);
    } else {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    }

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
  }, [isRunning, speedIndex, tick, gameState.isGameOver]);

  const controls: SimulationControls = {
    start,
    pause,
    reset,
    speedUp,
    slowDown,
    addSpecies,
    removeSpeciesById,
    skipSeason
  };

  const state: SimulationState = {
    gameState,
    isRunning,
    speed: SPEED_LEVELS[speedIndex],
    lastResult,
    speciesAtRisk
  };

  return {
    ...state,
    controls
  };
};
