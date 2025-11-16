require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import config
const connectDB = require('./config/db');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const matchRoutes = require('./routes/matchRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const { router: matchmakingRoutes, setMatchmakingService } = require('./routes/matchmakingRoutes');

// Import Socket.io handlers
const GameRoomManager = require('./socket/gameRooms');
const MatchmakingService = require('./socket/matchmaking');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/matchmaking', matchmakingRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Science Games API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      games: '/api/games',
      scores: '/api/scores',
      matches: '/api/matches',
      achievements: '/api/achievements',
      leaderboard: '/api/leaderboard',
      matchmaking: '/api/matchmaking',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Initialize Socket.io managers
const gameRoomManager = new GameRoomManager(io);
const matchmakingService = new MatchmakingService();

// Set matchmaking service for routes
setMatchmakingService(matchmakingService);

// Initialize game room handlers
gameRoomManager.init();

// Matchmaking queue cleanup interval (every 5 minutes)
setInterval(() => {
  matchmakingService.clearOldEntries(300000); // 5 minutes
  console.log('Matchmaking queue cleanup completed');
}, 300000);

// Export io and matchmaking for use in controllers if needed
app.set('io', io);
app.set('matchmaking', matchmakingService);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Server listening on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`🎮 Socket.io initialized for real-time gaming`);
  console.log(`🏆 Matchmaking service active`);
  console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = { app, server, io };
