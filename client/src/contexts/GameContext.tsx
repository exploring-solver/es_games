import { createContext, useContext, useState, ReactNode } from 'react'

export interface Game {
  id: string
  name: string
  description: string
  category: string
  maxPlayers: number
  minPlayers: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  duration: string
  icon: string
  path: string
  color: string
}

interface GameRoom {
  id: string
  gameId: string
  players: string[]
  status: 'waiting' | 'playing' | 'finished'
  maxPlayers: number
}

interface GameContextType {
  games: Game[]
  currentGame: Game | null
  currentRoom: GameRoom | null
  setCurrentGame: (game: Game | null) => void
  setCurrentRoom: (room: GameRoom | null) => void
  getGameById: (id: string) => Game | undefined
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

interface GameProviderProps {
  children: ReactNode
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null)

  const games: Game[] = [
    {
      id: 'ai-training-arena',
      name: 'AI Training Arena',
      description: 'Train and battle AI models in strategic competitions',
      category: 'Strategy',
      maxPlayers: 4,
      minPlayers: 1,
      difficulty: 'Hard',
      duration: '15-20 min',
      icon: '🤖',
      path: '/games/ai-training-arena',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'chemical-compound-crafting',
      name: 'Chemical Compound Crafting',
      description: 'Combine elements to create compounds and solve chemistry puzzles',
      category: 'Puzzle',
      maxPlayers: 2,
      minPlayers: 1,
      difficulty: 'Medium',
      duration: '10-15 min',
      icon: '⚗️',
      path: '/games/chemical-compound-crafting',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'ecosystem-simulator',
      name: 'Ecosystem Simulator',
      description: 'Build and balance thriving ecosystems with predators and prey',
      category: 'Simulation',
      maxPlayers: 4,
      minPlayers: 1,
      difficulty: 'Medium',
      duration: '20-30 min',
      icon: '🌿',
      path: '/games/ecosystem-simulator',
      color: 'from-lime-500 to-green-600',
    },
    {
      id: 'escape-room-lab-disaster',
      name: 'Escape Room: Lab Disaster',
      description: 'Solve science puzzles to escape from a laboratory disaster',
      category: 'Puzzle',
      maxPlayers: 6,
      minPlayers: 2,
      difficulty: 'Hard',
      duration: '30-45 min',
      icon: '🔬',
      path: '/games/escape-room-lab-disaster',
      color: 'from-red-500 to-orange-500',
    },
    {
      id: 'gene-splicer-simulator',
      name: 'Gene Splicer Simulator',
      description: 'Manipulate DNA sequences to create new organisms',
      category: 'Puzzle',
      maxPlayers: 2,
      minPlayers: 1,
      difficulty: 'Hard',
      duration: '15-20 min',
      icon: '🧬',
      path: '/games/gene-splicer-simulator',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'mind-readers-duel',
      name: "Mind Reader's Duel",
      description: 'Predict your opponent\'s moves in this psychological strategy game',
      category: 'Strategy',
      maxPlayers: 2,
      minPlayers: 2,
      difficulty: 'Medium',
      duration: '10-15 min',
      icon: '🧠',
      path: '/games/mind-readers-duel',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'neuro-network',
      name: 'Neuro Network',
      description: 'Connect neurons and build neural pathways to solve puzzles',
      category: 'Puzzle',
      maxPlayers: 4,
      minPlayers: 1,
      difficulty: 'Medium',
      duration: '15-20 min',
      icon: '🧪',
      path: '/games/neuro-network',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'particle-collider-challenge',
      name: 'Particle Collider Challenge',
      description: 'Smash particles together to discover new elements',
      category: 'Action',
      maxPlayers: 4,
      minPlayers: 1,
      difficulty: 'Hard',
      duration: '10-15 min',
      icon: '⚛️',
      path: '/games/particle-collider-challenge',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'physics-puzzle-relay',
      name: 'Physics Puzzle Relay',
      description: 'Solve physics-based puzzles using momentum, gravity, and energy',
      category: 'Puzzle',
      maxPlayers: 4,
      minPlayers: 1,
      difficulty: 'Medium',
      duration: '15-20 min',
      icon: '🎯',
      path: '/games/physics-puzzle-relay',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'quantum-chess',
      name: 'Quantum Chess',
      description: 'Chess with quantum mechanics - pieces exist in superposition',
      category: 'Strategy',
      maxPlayers: 2,
      minPlayers: 2,
      difficulty: 'Hard',
      duration: '20-30 min',
      icon: '♟️',
      path: '/games/quantum-chess',
      color: 'from-slate-500 to-gray-600',
    },
    {
      id: 'science-codenames',
      name: 'Science Codenames',
      description: 'Give one-word clues to help teammates identify science terms',
      category: 'Party',
      maxPlayers: 8,
      minPlayers: 4,
      difficulty: 'Easy',
      duration: '15-20 min',
      icon: '🔤',
      path: '/games/science-codenames',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'science-quiz-showdown',
      name: 'Science Quiz Showdown',
      description: 'Fast-paced trivia competition on all things science',
      category: 'Trivia',
      maxPlayers: 8,
      minPlayers: 1,
      difficulty: 'Easy',
      duration: '10-15 min',
      icon: '❓',
      path: '/games/science-quiz-showdown',
      color: 'from-amber-500 to-yellow-500',
    },
    {
      id: 'time-loop-strategist',
      name: 'Time Loop Strategist',
      description: 'Manipulate time loops to solve complex strategic puzzles',
      category: 'Strategy',
      maxPlayers: 2,
      minPlayers: 1,
      difficulty: 'Hard',
      duration: '20-30 min',
      icon: '⏰',
      path: '/games/time-loop-strategist',
      color: 'from-violet-500 to-purple-600',
    },
  ]

  const getGameById = (id: string) => {
    return games.find(game => game.id === id)
  }

  const value = {
    games,
    currentGame,
    currentRoom,
    setCurrentGame,
    setCurrentRoom,
    getGameById,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
