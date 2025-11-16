import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 bg-science-pattern opacity-10" />

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Outlet />
        </motion.main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 mt-20 border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About */}
              <div>
                <h3 className="text-xl font-display font-bold mb-4 gradient-text">
                  About Science Games
                </h3>
                <p className="text-white/70 text-sm">
                  An innovative platform combining education and entertainment through
                  interactive science-based multiplayer games. Learn while you play!
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-display font-bold mb-4 gradient-text">
                  Quick Links
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/" className="text-white/70 hover:text-accent-400 transition-colors">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/70 hover:text-accent-400 transition-colors">
                      Leaderboard
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/70 hover:text-accent-400 transition-colors">
                      How to Play
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/70 hover:text-accent-400 transition-colors">
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-xl font-display font-bold mb-4 gradient-text">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  {['🐦', '📘', '📷', '🎮'].map((emoji, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="glass-effect w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-white/20 transition-all"
                    >
                      {emoji}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
              <p>&copy; 2024 Science Games Platform. All rights reserved.</p>
              <p className="mt-2">
                Made with ❤️ by science enthusiasts, for science enthusiasts.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

export default Layout
