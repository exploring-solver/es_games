/**
 * Quantum Chess - Quantum Logic Hook
 * Handles quantum effects, animations, and visual feedback
 */

import { useState, useEffect, useCallback } from 'react';
import { Piece, Position, positionsEqual } from '../utils/quantumMechanics';

export interface QuantumAnimation {
  id: string;
  type: 'superposition' | 'collapse' | 'entanglement' | 'tunneling' | 'interference';
  positions: Position[];
  duration: number;
  timestamp: number;
}

export interface QuantumVisualization {
  position: Position;
  probability: number;
  isGhost: boolean;
  opacity: number;
}

interface UseQuantumLogicReturn {
  animations: QuantumAnimation[];
  visualizations: Map<string, QuantumVisualization[]>;
  addAnimation: (type: QuantumAnimation['type'], positions: Position[], duration?: number) => void;
  updateVisualizations: (pieces: Piece[]) => void;
  clearAnimations: () => void;
  getQuantumIntensity: (position: Position) => number;
}

export function useQuantumLogic(): UseQuantumLogicReturn {
  const [animations, setAnimations] = useState<QuantumAnimation[]>([]);
  const [visualizations, setVisualizations] = useState<Map<string, QuantumVisualization[]>>(new Map());

  /**
   * Add quantum animation
   */
  const addAnimation = useCallback((
    type: QuantumAnimation['type'],
    positions: Position[],
    duration: number = 1000
  ) => {
    const animation: QuantumAnimation = {
      id: `anim-${Date.now()}-${Math.random()}`,
      type,
      positions,
      duration,
      timestamp: Date.now()
    };

    setAnimations(prev => [...prev, animation]);

    // Auto-remove after duration
    setTimeout(() => {
      setAnimations(prev => prev.filter(a => a.id !== animation.id));
    }, duration);
  }, []);

  /**
   * Update quantum visualizations based on piece states
   */
  const updateVisualizations = useCallback((pieces: Piece[]) => {
    const newVisualizations = new Map<string, QuantumVisualization[]>();

    pieces.forEach(piece => {
      const pieceVisuals: QuantumVisualization[] = [];

      // Sort quantum states by probability
      const sortedStates = [...piece.quantumStates].sort((a, b) => b.probability - a.probability);

      sortedStates.forEach((state, index) => {
        const isMainState = index === 0;
        const visualization: QuantumVisualization = {
          position: state.position,
          probability: state.probability,
          isGhost: !isMainState,
          opacity: isMainState ? 1.0 : state.probability * 0.7
        };

        pieceVisuals.push(visualization);
      });

      newVisualizations.set(piece.id, pieceVisuals);
    });

    setVisualizations(newVisualizations);
  }, []);

  /**
   * Clear all animations
   */
  const clearAnimations = useCallback(() => {
    setAnimations([]);
  }, []);

  /**
   * Get quantum intensity at a position (for visual effects)
   */
  const getQuantumIntensity = useCallback((position: Position): number => {
    let intensity = 0;

    visualizations.forEach(visuals => {
      visuals.forEach(visual => {
        if (positionsEqual(visual.position, position)) {
          intensity += visual.probability;
        }
      });
    });

    // Normalize to 0-1 range
    return Math.min(intensity, 1);
  }, [visualizations]);

  return {
    animations,
    visualizations,
    addAnimation,
    updateVisualizations,
    clearAnimations,
    getQuantumIntensity
  };
}
