export { EscapeRoom as default } from './EscapeRoom';
export { EscapeRoom } from './EscapeRoom';

// Export components
export { Room } from './components/Room';
export { Puzzle } from './components/Puzzle';
export { Inventory } from './components/Inventory';
export { Timer } from './components/Timer';
export { CoopIndicators } from './components/CoopIndicators';

// Export hooks
export { usePuzzleGenerator } from './hooks/usePuzzleGenerator';
export { useCoopSync } from './hooks/useCoopSync';

// Export data types
export type { PuzzleData, ItemData } from './data/puzzles';
export type { RoomData, DisasterScenario, DisasterData, InteractiveObject } from './data/rooms';
export type { Player } from './hooks/useCoopSync';

// Export utilities
export * as puzzleLogic from './utils/puzzleLogic';
export * as roomGeneration from './utils/roomGeneration';
