import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Game } from '../contexts/GameContext'

interface GameCardProps {
  game: Game
  index: number
}

const GameCard = ({ game, index }: GameCardProps) => {
  const navigate = useNavigate()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400'
      case 'Medium':
        return 'text-yellow-400'
      case 'Hard':
        return 'text-red-400'
      default:
        return 'text-white'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(game.path)}
      className="cursor-pointer"
    >
      <div className="science-card h-full flex flex-col relative overflow-hidden group">
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
        />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Icon & Title */}
          <div className="flex items-start justify-between mb-4">
            <div className="text-6xl group-hover:animate-bounce">{game.icon}</div>
            <div className="glass-effect rounded-full px-3 py-1">
              <span className="text-xs font-semibold text-accent-400">
                {game.category}
              </span>
            </div>
          </div>

          {/* Game Name */}
          <h3 className="text-2xl font-display font-bold mb-2 group-hover:gradient-text transition-all">
            {game.name}
          </h3>

          {/* Description */}
          <p className="text-white/70 text-sm mb-4 flex-1">{game.description}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="glass-effect rounded-lg p-2 text-center">
              <div className="text-xs text-white/50 mb-1">Players</div>
              <div className="font-semibold text-sm">
                {game.minPlayers === game.maxPlayers
                  ? game.maxPlayers
                  : `${game.minPlayers}-${game.maxPlayers}`}
              </div>
            </div>
            <div className="glass-effect rounded-lg p-2 text-center">
              <div className="text-xs text-white/50 mb-1">Duration</div>
              <div className="font-semibold text-sm">{game.duration}</div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-white/50 text-sm">Difficulty:</span>
              <span className={`font-bold text-sm ${getDifficultyColor(game.difficulty)}`}>
                {game.difficulty}
              </span>
            </div>

            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn-accent text-sm py-2 px-4"
              onClick={(e) => {
                e.stopPropagation()
                navigate(game.path)
              }}
            >
              Play Now
            </motion.button>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-400/50 rounded-2xl transition-all duration-300" />
      </div>
    </motion.div>
  )
}

export default GameCard
