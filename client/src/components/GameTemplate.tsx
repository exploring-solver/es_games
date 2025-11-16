import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGame, Game } from '../contexts/GameContext'
import { useEffect, ReactNode } from 'react'

interface GameTemplateProps {
  gameId: string
  children?: ReactNode
}

const GameTemplate = ({ gameId, children }: GameTemplateProps) => {
  const navigate = useNavigate()
  const { getGameById, setCurrentGame } = useGame()
  const game = getGameById(gameId)

  useEffect(() => {
    if (game) {
      setCurrentGame(game)
    }
    return () => setCurrentGame(null)
  }, [game, setCurrentGame])

  const getDifficultyColor = (difficulty?: string) => {
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

  if (!game) {
    return <div>Game not found</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect-strong rounded-2xl p-8"
      >
        <button
          onClick={() => navigate('/')}
          className="text-white/70 hover:text-white mb-4 flex items-center space-x-2 transition-colors"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-6xl mb-4">{game.icon}</div>
            <h1 className="text-5xl font-display font-bold gradient-text mb-4">
              {game.name}
            </h1>
            <p className="text-xl text-white/80 mb-6">{game.description}</p>

            <div className="flex flex-wrap gap-4">
              <div className="glass-effect rounded-lg px-4 py-2">
                <span className="text-white/70">Category: </span>
                <span className="font-bold text-accent-400">{game.category}</span>
              </div>
              <div className="glass-effect rounded-lg px-4 py-2">
                <span className="text-white/70">Players: </span>
                <span className="font-bold">
                  {game.minPlayers === game.maxPlayers
                    ? game.maxPlayers
                    : `${game.minPlayers}-${game.maxPlayers}`}
                </span>
              </div>
              <div className="glass-effect rounded-lg px-4 py-2">
                <span className="text-white/70">Duration: </span>
                <span className="font-bold">{game.duration}</span>
              </div>
              <div className="glass-effect rounded-lg px-4 py-2">
                <span className="text-white/70">Difficulty: </span>
                <span className={`font-bold ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Game Content */}
      {children || (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="science-card text-center py-20"
        >
          <div className="text-6xl mb-6">{game.icon}</div>
          <h2 className="text-3xl font-bold mb-4">Game Coming Soon!</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            This game is currently under development. Check back soon for an amazing
            {' '}{game.category.toLowerCase()} experience!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-accent"
          >
            Join Waiting List
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default GameTemplate
