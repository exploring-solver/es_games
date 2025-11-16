import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../hooks/useSocket'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { connected } = useSocket()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-effect-strong sticky top-0 z-50 border-b border-white/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-3xl">🔬</div>
              <span className="text-2xl font-display font-bold gradient-text">
                Science Games
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/90 hover:text-white font-semibold transition-colors"
              >
                Dashboard
              </motion.button>
            </Link>

            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? 'bg-accent-400 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-white/70">
                {connected ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* User Section */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="glass-effect rounded-lg px-4 py-2">
                  <span className="text-white font-semibold">{user.username}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-accent"
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
