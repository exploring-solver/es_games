import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../contexts/GameContext'
import { GameCard, Leaderboard } from '../components'

const Dashboard = () => {
  const { games } = useGame()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', 'Strategy', 'Puzzle', 'Simulation', 'Action', 'Trivia', 'Party']

  const filteredGames = games.filter((game) => {
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory
    const matchesSearch =
      searchQuery === '' ||
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <motion.h1
          className="text-6xl md:text-7xl font-display font-bold gradient-text"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          Science Games Platform
        </motion.h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Explore the fascinating world of science through interactive multiplayer games.
          Challenge your friends, climb the leaderboard, and learn while having fun!
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="text-4xl mb-2">🎮</div>
            <div className="text-3xl font-bold text-accent-400">{games.length}</div>
            <div className="text-white/70">Games Available</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-accent-400">1,234</div>
            <div className="text-white/70">Active Players</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-accent-400">5,678</div>
            <div className="text-white/70">Games Played Today</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-12"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
              🔍
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-gray-900 shadow-lg shadow-accent-500/50'
                  : 'glass-effect text-white hover:bg-white/20'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Games Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-display font-bold mb-6 gradient-text">
          {selectedCategory === 'All' ? 'All Games' : `${selectedCategory} Games`}
          <span className="text-white/50 text-xl ml-3">({filteredGames.length})</span>
        </h2>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔬</div>
            <h3 className="text-2xl font-bold mb-2">No games found</h3>
            <p className="text-white/70">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </motion.div>

      {/* Leaderboard Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Leaderboard />
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-effect-strong rounded-2xl p-12 text-center"
      >
        <h2 className="text-4xl font-display font-bold mb-4 gradient-text">
          Ready to Play?
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Choose a game above and start your scientific adventure. Compete with players
          worldwide and prove your knowledge!
        </p>
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-accent text-lg"
          >
            Browse All Games
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg"
          >
            View Leaderboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
