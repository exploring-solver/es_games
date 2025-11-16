// Game categories
export const GAME_CATEGORIES = [
  'All',
  'Strategy',
  'Puzzle',
  'Simulation',
  'Action',
  'Trivia',
  'Party',
] as const

export type GameCategory = typeof GAME_CATEGORIES[number]

// Difficulty levels
export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'] as const

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number]

// Leaderboard filters
export const LEADERBOARD_FILTERS = ['all', 'daily', 'weekly'] as const

export type LeaderboardFilter = typeof LEADERBOARD_FILTERS[number]

// Socket events
export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Game room events
  ROOM_CREATED: 'room:created',
  ROOM_JOINED: 'room:joined',
  ROOM_LEFT: 'room:left',
  ROOM_UPDATED: 'room:updated',
  ROOM_STARTED: 'room:started',
  ROOM_ENDED: 'room:ended',

  // Player events
  PLAYER_JOINED: 'player:joined',
  PLAYER_LEFT: 'player:left',
  PLAYER_READY: 'player:ready',

  // Game events
  GAME_STATE_UPDATE: 'game:state:update',
  GAME_ACTION: 'game:action',
  GAME_MOVE: 'game:move',
  GAME_TURN_CHANGE: 'game:turn:change',

  // Chat events
  CHAT_MESSAGE: 'chat:message',
  CHAT_SYSTEM: 'chat:system',
} as const

// Game status
export const GAME_STATUS = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished',
  PAUSED: 'paused',
} as const

export type GameStatus = typeof GAME_STATUS[keyof typeof GAME_STATUS]

// Animation durations (in ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  SOUND_ENABLED: 'soundEnabled',
  MUSIC_ENABLED: 'musicEnabled',
} as const

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  GAMES: '/games',
  LEADERBOARD: '/leaderboard',
  USERS: '/users',
  ROOMS: '/rooms',
} as const

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_FAILED: 'Authentication failed. Please try again.',
  ROOM_FULL: 'This game room is full.',
  GAME_NOT_FOUND: 'Game not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  ROOM_JOINED: 'Successfully joined the game room!',
  ROOM_CREATED: 'Game room created successfully!',
} as const

// Validation rules
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const

export default {
  GAME_CATEGORIES,
  DIFFICULTY_LEVELS,
  LEADERBOARD_FILTERS,
  SOCKET_EVENTS,
  GAME_STATUS,
  ANIMATION_DURATION,
  STORAGE_KEYS,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
}
