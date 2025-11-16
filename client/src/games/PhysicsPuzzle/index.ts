export { PhysicsPuzzle as default } from './PhysicsPuzzle';
export { PhysicsPuzzle } from './PhysicsPuzzle';

// Export components
export { PuzzleCanvas } from './components/PuzzleCanvas';
export { ForceVisualizer, ForceLegend } from './components/ForceVisualizer';
export { RelayProgress, RelayStats } from './components/RelayProgress';
export { PhysicsObjectInfo, ObjectPalette } from './components/PhysicsObject';

// Export hooks
export { usePhysicsEngine } from './hooks/usePhysicsEngine';
export { useRelayLogic } from './hooks/useRelayLogic';

// Export utilities
export { PhysicsSimulation } from './utils/physicsSimulation';
export { PuzzleGenerator } from './utils/puzzleGenerator';

// Export data
export { puzzleLevels, getConceptForLevel } from './data/puzzles';
export { physicsConcepts, puzzleTemplates } from './data/physicsScenarios';

// Export types
export type { PhysicsObject, PuzzleLevel } from './data/puzzles';
export type { PhysicsConcept } from './data/physicsScenarios';
export type { Vector2D, ForceVector } from './utils/physicsSimulation';
export type { RelayPlayer, RelayState, RelayEffect } from './hooks/useRelayLogic';
