import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  gamesPlayed: number
  avatar?: string
}

interface LeaderboardProps {
  gameId?: string
  limit?: number
}

const Leaderboard = ({ gameId, limit = 10 }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all')

  useEffect(() => {
    fetchLeaderboard()
  }, [gameId, filter])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const endpoint = gameId
        ? `/api/leaderboard/${gameId}`
        : '/api/leaderboard'
      const response = await axios.get(endpoint, {
        params: { filter, limit },
      })
      setEntries(response.data)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      // Mock data for development
      setEntries([
        { rank: 1, username: 'QuantumMaster', score: 9850, gamesPlayed: 42 },
        { rank: 2, username: 'ScienceNerd', score: 8720, gamesPlayed: 38 },
        { rank: 3, username: 'ElementalWiz', score: 7650, gamesPlayed: 35 },
        { rank: 4, username: 'DNADecoder', score: 6890, gamesPlayed: 31 },
        { rank: 5, username: 'ParticlePro', score: 6230, gamesPlayed: 29 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600'
      case 2:
        return 'from-gray-300 to-gray-500'
      case 3:
        return 'from-orange-400 to-orange-600'
      default:
        return 'from-primary-400 to-primary-600'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  return (
    <div className="science-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold gradient-text">
          {gameId ? 'Game Leaderboard' : 'Global Leaderboard'}
        </h2>

        {/* Filter Buttons */}
        <div className="glass-effect rounded-lg p-1 flex space-x-1">
          {(['all', 'daily', 'weekly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-accent-500 text-gray-900'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="spinner w-12 h-12 border-4 border-accent-400 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-effect rounded-lg p-4 hover:bg-white/15 transition-all"
            >
              <div className="flex items-center justify-between">
                {/* Rank & User Info */}
                <div className="flex items-center space-x-4 flex-1">
                  {/* Rank Badge */}
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(
                      entry.rank
                    )} flex items-center justify-center font-bold text-lg shadow-lg`}
                  >
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* User Details */}
                  <div className="flex-1">
                    <div className="font-bold text-lg">{entry.username}</div>
                    <div className="text-sm text-white/50">
                      {entry.gamesPlayed} games played
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent-400">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/50">points</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Data Message */}
      {!loading && entries.length === 0 && (
        <div className="text-center py-8 text-white/50">
          No leaderboard data available yet. Be the first to play!
        </div>
      )}
    </div>
  )
}

export default Leaderboard
