import { motion } from 'framer-motion'

interface LoadingScreenProps {
  message?: string
}

const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  const particles = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent-400 rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Animated Logo */}
        <motion.div
          className="mb-8"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="text-8xl">🔬</div>
        </motion.div>

        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 border-4 border-primary-400 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            {/* Inner Ring */}
            <motion.div
              className="absolute inset-2 border-4 border-accent-400 border-b-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            {/* Center Dot */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="w-3 h-3 bg-accent-400 rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Loading Text */}
        <motion.h2
          className="text-2xl font-display font-bold gradient-text mb-4"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {message}
        </motion.h2>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-accent-400 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Science-themed Quote */}
        <motion.p
          className="mt-8 text-white/50 text-sm italic max-w-md mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          "The important thing is not to stop questioning. Curiosity has its own reason
          for existing." - Albert Einstein
        </motion.p>
      </div>
    </div>
  )
}

export default LoadingScreen
