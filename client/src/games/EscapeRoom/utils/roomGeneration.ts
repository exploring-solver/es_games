import { RoomData, DisasterScenario, DisasterData, disasters } from '../data/rooms';
import { PuzzleData, allPuzzles } from '../data/puzzles';

export interface GamePath {
  rooms: RoomData[];
  requiredPuzzles: PuzzleData[];
  estimatedTime: number;
  difficulty: 'normal' | 'hard' | 'extreme';
}

export interface RoomProgress {
  roomId: string;
  visited: boolean;
  puzzlesSolved: string[];
  itemsCollected: string[];
  requiredSolvesRemaining: number;
  unlocked: boolean;
}

/**
 * Generate a game path for a specific disaster scenario
 */
export const generateGamePath = (
  disaster: DisasterData,
  playerCount: number
): GamePath => {
  const availableRooms = disaster.objectiveRooms;
  const path: GamePath = {
    rooms: [],
    requiredPuzzles: [],
    estimatedTime: disaster.timeLimit,
    difficulty: disaster.difficulty
  };

  // Get all rooms in the objective path
  availableRooms.forEach(roomId => {
    const room = getRoomById(roomId);
    if (room) {
      path.rooms.push(room);

      // Add puzzles from this room
      room.availablePuzzles.forEach(puzzleId => {
        const puzzle = getPuzzleById(puzzleId);
        if (puzzle) {
          // Filter puzzles based on player count
          if (!puzzle.requiredPlayers || puzzle.requiredPlayers <= playerCount) {
            path.requiredPuzzles.push(puzzle);
          }
        }
      });
    }
  });

  return path;
};

/**
 * Get room by ID
 */
export const getRoomById = (roomId: string): RoomData | undefined => {
  const { labRooms } = require('../data/rooms');
  return labRooms.find((room: RoomData) => room.id === roomId);
};

/**
 * Get puzzle by ID
 */
export const getPuzzleById = (puzzleId: string): PuzzleData | undefined => {
  return allPuzzles.find(puzzle => puzzle.id === puzzleId);
};

/**
 * Check if a room is accessible based on current progress
 */
export const isRoomAccessible = (
  room: RoomData,
  inventory: string[],
  completedRooms: string[]
): { accessible: boolean; reason?: string } => {
  // Check required items
  if (room.requiredItems && room.requiredItems.length > 0) {
    const missingItems = room.requiredItems.filter(item => !inventory.includes(item));
    if (missingItems.length > 0) {
      return {
        accessible: false,
        reason: `Required items missing: ${missingItems.join(', ')}`
      };
    }
  }

  // Check if connected to a completed room
  const hasAccessibleConnection = room.connectedRooms.some(
    connectedId => connectedId === 'room_01' || completedRooms.includes(connectedId)
  );

  if (!hasAccessibleConnection && room.id !== 'room_01') {
    return {
      accessible: false,
      reason: 'Must complete connected room first'
    };
  }

  return { accessible: true };
};

/**
 * Calculate room completion percentage
 */
export const calculateRoomCompletion = (
  room: RoomData,
  solvedPuzzles: string[]
): number => {
  const roomPuzzles = room.availablePuzzles;
  const solvedInRoom = solvedPuzzles.filter(id => roomPuzzles.includes(id)).length;

  return Math.min((solvedInRoom / room.requiredPuzzleSolves) * 100, 100);
};

/**
 * Get next recommended room
 */
export const getNextRecommendedRoom = (
  currentRoom: RoomData,
  allProgress: { [roomId: string]: RoomProgress },
  inventory: string[]
): RoomData | null => {
  const connectedRooms = currentRoom.connectedRooms
    .map(id => getRoomById(id))
    .filter((room): room is RoomData => room !== undefined);

  // Prioritize rooms that are:
  // 1. Accessible
  // 2. Not yet completed
  // 3. Have the right difficulty progression

  for (const room of connectedRooms) {
    const progress = allProgress[room.id];
    const { accessible } = isRoomAccessible(room, inventory,
      Object.keys(allProgress).filter(id => allProgress[id].unlocked)
    );

    if (accessible && progress && progress.requiredSolvesRemaining > 0) {
      return room;
    }
  }

  return null;
};

/**
 * Generate random room layout variant
 */
export const generateRoomVariant = (
  baseRoom: RoomData,
  seed: number
): RoomData => {
  // Create a variant with randomized object positions
  const variant = { ...baseRoom };

  variant.interactiveObjects = baseRoom.interactiveObjects.map((obj, idx) => {
    const randomX = ((seed + idx * 17) % 60) + 20; // 20-80 range
    const randomY = ((seed + idx * 23) % 50) + 30; // 30-80 range

    return {
      ...obj,
      x: randomX,
      y: randomY
    };
  });

  return variant;
};

/**
 * Select puzzles for a room based on disaster type and difficulty
 */
export const selectPuzzlesForRoom = (
  room: RoomData,
  disaster: DisasterScenario,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number
): PuzzleData[] => {
  const availablePuzzles = room.availablePuzzles
    .map(id => getPuzzleById(id))
    .filter((p): p is PuzzleData => p !== undefined)
    .filter(p => p.difficulty === difficulty || p.difficulty === 'medium'); // Include medium as fallback

  // Shuffle and select
  const shuffled = [...availablePuzzles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Calculate overall game progress
 */
export const calculateOverallProgress = (
  disaster: DisasterData,
  roomProgress: { [roomId: string]: RoomProgress },
  puzzlesSolved: string[]
): { percentage: number; roomsCompleted: number; puzzlesCompleted: number } => {
  const objectiveRooms = disaster.objectiveRooms;
  const completedRooms = objectiveRooms.filter(id => {
    const progress = roomProgress[id];
    return progress && progress.requiredSolvesRemaining === 0;
  });

  const percentage = (completedRooms.length / objectiveRooms.length) * 100;

  return {
    percentage: Math.round(percentage),
    roomsCompleted: completedRooms.length,
    puzzlesCompleted: puzzlesSolved.length
  };
};

/**
 * Get disaster by type
 */
export const getDisasterByType = (type: DisasterScenario): DisasterData | undefined => {
  return disasters.find(d => d.id === type);
};

/**
 * Generate hint for current situation
 */
export const generateSituationHint = (
  currentRoom: RoomData,
  inventory: string[],
  solvedPuzzles: string[],
  disaster: DisasterData
): string => {
  const roomCompletion = calculateRoomCompletion(currentRoom, solvedPuzzles);

  if (roomCompletion === 0) {
    return `You've just entered ${currentRoom.name}. Look around for interactive objects and puzzles to solve.`;
  }

  if (roomCompletion < 100) {
    const remaining = currentRoom.requiredPuzzleSolves -
      solvedPuzzles.filter(id => currentRoom.availablePuzzles.includes(id)).length;
    return `You need to solve ${remaining} more puzzle(s) in this room to proceed.`;
  }

  const nextRoom = getNextRecommendedRoom(
    currentRoom,
    {} as any, // Simplified for hint generation
    inventory
  );

  if (nextRoom) {
    return `Room complete! Head to ${nextRoom.name} next.`;
  }

  return `Check if you have all required items to access the final objective rooms.`;
};

/**
 * Validate game state
 */
export const validateGameState = (
  disaster: DisasterData,
  roomProgress: { [roomId: string]: RoomProgress },
  timeRemaining: number
): { valid: boolean; canWin: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  // Check time
  if (timeRemaining <= 0) {
    return {
      valid: false,
      canWin: false,
      warnings: ['Time has run out!']
    };
  }

  if (timeRemaining < 300) {
    warnings.push('Less than 5 minutes remaining!');
  }

  // Check objective rooms
  const objectiveCompletion = disaster.objectiveRooms.map(id => {
    const progress = roomProgress[id];
    return progress ? progress.requiredSolvesRemaining === 0 : false;
  });

  const allObjectivesComplete = objectiveCompletion.every(complete => complete);

  if (!allObjectivesComplete) {
    const remaining = objectiveCompletion.filter(c => !c).length;
    warnings.push(`${remaining} objective room(s) remaining`);
  }

  return {
    valid: true,
    canWin: allObjectivesComplete,
    warnings
  };
};

/**
 * Generate achievement data
 */
export const checkAchievements = (
  disaster: DisasterData,
  timeRemaining: number,
  hintsUsed: number,
  playerCount: number
): string[] => {
  const achievements: string[] = [];

  // Speed run achievements
  const timeUsed = disaster.timeLimit - timeRemaining;
  if (timeUsed < disaster.timeLimit * 0.5) {
    achievements.push('SPEED_DEMON');
  }
  if (timeUsed < disaster.timeLimit * 0.33) {
    achievements.push('LIGHTNING_FAST');
  }

  // No hints achievement
  if (hintsUsed === 0) {
    achievements.push('GENIUS');
  }

  // Cooperation achievements
  if (playerCount >= 3) {
    achievements.push('TEAM_PLAYER');
  }
  if (playerCount === 4) {
    achievements.push('FULL_SQUAD');
  }

  // Disaster-specific achievements
  achievements.push(`${disaster.id.toUpperCase()}_SURVIVOR`);

  return achievements;
};

/**
 * Calculate final score
 */
export const calculateFinalScore = (
  puzzleScores: number[],
  timeRemaining: number,
  disaster: DisasterData,
  achievements: string[]
): number => {
  const puzzleScore = puzzleScores.reduce((sum, score) => sum + score, 0);

  // Time bonus
  const timePercentage = timeRemaining / disaster.timeLimit;
  const timeBonus = Math.round(timePercentage * 500);

  // Achievement bonus
  const achievementBonus = achievements.length * 100;

  // Difficulty multiplier
  const difficultyMultiplier = {
    normal: 1.0,
    hard: 1.5,
    extreme: 2.0
  };

  const totalScore = (puzzleScore + timeBonus + achievementBonus) *
    difficultyMultiplier[disaster.difficulty];

  return Math.round(totalScore);
};

/**
 * Get connected rooms that are unlocked
 */
export const getUnlockedConnectedRooms = (
  currentRoom: RoomData,
  roomProgress: { [roomId: string]: RoomProgress }
): RoomData[] => {
  return currentRoom.connectedRooms
    .filter(id => roomProgress[id]?.unlocked)
    .map(id => getRoomById(id))
    .filter((room): room is RoomData => room !== undefined);
};

/**
 * Initialize room progress for all rooms
 */
export const initializeRoomProgress = (
  disaster: DisasterData
): { [roomId: string]: RoomProgress } => {
  const progress: { [roomId: string]: RoomProgress } = {};

  // Get all rooms compatible with this disaster
  const { labRooms } = require('../data/rooms');
  const compatibleRooms = labRooms.filter((room: RoomData) =>
    room.disasterCompatible.includes(disaster.id)
  );

  compatibleRooms.forEach((room: RoomData) => {
    progress[room.id] = {
      roomId: room.id,
      visited: room.id === 'room_01', // Start room is visited
      puzzlesSolved: [],
      itemsCollected: [],
      requiredSolvesRemaining: room.requiredPuzzleSolves,
      unlocked: room.id === 'room_01' || !room.requiredItems // Unlock if no requirements
    };
  });

  return progress;
};

export default {
  generateGamePath,
  getRoomById,
  getPuzzleById,
  isRoomAccessible,
  calculateRoomCompletion,
  getNextRecommendedRoom,
  generateRoomVariant,
  selectPuzzlesForRoom,
  calculateOverallProgress,
  getDisasterByType,
  generateSituationHint,
  validateGameState,
  checkAchievements,
  calculateFinalScore,
  getUnlockedConnectedRooms,
  initializeRoomProgress
};
