# Science Games Server

A comprehensive Express.js + MongoDB backend for multiplayer science-based browser games with real-time features using Socket.io.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Game Management**: CRUD operations for games with categories, difficulty levels, and educational content
- **Score System**: Personal bests, leaderboards (global, game-specific, category, friends, trending)
- **Multiplayer Matches**: Real-time game rooms with Socket.io
- **Matchmaking**: Automated player matching based on skill level and preferences
- **Achievements System**: Unlock achievements and earn rewards
- **Social Features**: Friends system, chat in game rooms
- **Security**: Helmet, CORS, rate limiting, input validation
- **Error Handling**: Centralized error handling with proper status codes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Validation**: express-validator

## Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── gameController.js     # Game management logic
│   ├── scoreController.js    # Score submission and retrieval
│   └── matchController.js    # Match management
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Error handling middleware
│   └── validate.js          # Validation middleware
├── models/
│   ├── User.js              # User schema
│   ├── Game.js              # Game schema
│   ├── Score.js             # Score schema
│   ├── Match.js             # Match schema
│   └── Achievement.js       # Achievement schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── gameRoutes.js        # Game routes
│   ├── scoreRoutes.js       # Score routes
│   ├── matchRoutes.js       # Match routes
│   ├── achievementRoutes.js # Achievement routes
│   ├── leaderboardRoutes.js # Leaderboard routes
│   └── matchmakingRoutes.js # Matchmaking routes
├── socket/
│   ├── gameRooms.js         # Socket.io game room management
│   └── matchmaking.js       # Matchmaking service
├── utils/
│   ├── leaderboard.js       # Leaderboard aggregation queries
│   └── achievementService.js # Achievement checking and awarding
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies
├── server.js               # Main server file
└── README.md               # This file
```

## Installation

1. **Clone the repository**
   ```bash
   cd /home/user/es_games/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   Make sure MongoDB is running locally or update MONGODB_URI in .env for MongoDB Atlas

5. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## Environment Variables

See `.env.example` for all required environment variables. Key variables:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Allowed CORS origin

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user (protected)
- `GET /me` - Get current user (protected)
- `PUT /updatedetails` - Update user details (protected)
- `PUT /updatepassword` - Update password (protected)
- `PUT /preferences` - Update preferences (protected)
- `POST /friends/:userId` - Add friend (protected)
- `DELETE /friends/:userId` - Remove friend (protected)
- `GET /profile/:userId` - Get user profile

### Games (`/api/games`)
- `GET /` - Get all games
- `GET /popular` - Get popular games
- `GET /recommended` - Get recommended games (protected)
- `GET /slug/:slug` - Get game by slug
- `GET /:id` - Get single game
- `GET /:id/stats` - Get game statistics
- `POST /:id/play` - Increment play count
- `POST /:id/rate` - Rate game (protected)
- `POST /` - Create game (admin)
- `PUT /:id` - Update game (admin)
- `DELETE /:id` - Delete game (admin)

### Scores (`/api/scores`)
- `POST /` - Submit score (protected)
- `GET /me` - Get user's scores (protected)
- `GET /personal-bests` - Get personal bests (protected)
- `GET /leaderboard/:gameId` - Get game leaderboard
- `GET /global-leaderboard` - Get global leaderboard
- `GET /stats/:userId` - Get user score statistics
- `DELETE /:id` - Delete score (protected)

### Matches (`/api/matches`)
- `POST /` - Create match (protected)
- `GET /` - Get all matches
- `GET /available/:gameId` - Get available matches
- `GET /room/:roomId` - Get match by room ID
- `GET /user/:userId` - Get user's match history
- `GET /:id` - Get single match
- `POST /:id/join` - Join match (protected)
- `POST /:id/leave` - Leave match (protected)
- `PUT /:id/ready` - Toggle ready status (protected)
- `POST /:id/start` - Start match (protected)
- `POST /:id/complete` - Complete match (protected)
- `DELETE /:id` - Cancel match (protected)

### Achievements (`/api/achievements`)
- `GET /` - Get all achievements
- `GET /progress` - Get user's achievement progress (protected)
- `GET /:id` - Get single achievement
- `POST /` - Create achievement (admin)
- `PUT /:id` - Update achievement (admin)
- `DELETE /:id` - Delete achievement (admin)

### Leaderboard (`/api/leaderboard`)
- `GET /game/:gameId` - Get game leaderboard
- `GET /global` - Get global leaderboard
- `GET /category/:category` - Get category leaderboard
- `GET /friends` - Get friends leaderboard (protected)
- `GET /rank` - Get user rank (protected)
- `GET /trending` - Get trending players
- `GET /stats` - Get leaderboard statistics

### Matchmaking (`/api/matchmaking`)
- `POST /queue` - Join matchmaking queue (protected)
- `DELETE /queue` - Leave matchmaking queue (protected)
- `GET /queue/status` - Get queue status (protected)
- `GET /queue/:gameId` - Get game queue status
- `POST /quick` - Quick match (protected)
- `POST /ranked` - Ranked matchmaking (protected)
- `GET /queues` - Get all queues (admin)

## Socket.io Events

### Client to Server
- `authenticate` - Authenticate socket connection
- `create-room` - Create game room
- `join-room` - Join game room
- `leave-room` - Leave game room
- `toggle-ready` - Toggle ready status
- `start-game` - Start game
- `game-state` - Update game state
- `player-action` - Send player action
- `chat-message` - Send chat message
- `end-game` - End game

### Server to Client
- `authenticated` - Authentication successful
- `auth-error` - Authentication failed
- `room-created` - Room created
- `joined-room` - Successfully joined room
- `player-joined` - Player joined room
- `player-left` - Player left room
- `player-ready-changed` - Player ready status changed
- `game-started` - Game started
- `player-state-update` - Player state updated
- `player-action` - Player action broadcast
- `chat-message` - Chat message received
- `game-ended` - Game ended
- `room-closed` - Room closed
- `error` - Error occurred

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password encryption
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: express-validator for request validation
- **Error Handling**: Proper error responses without exposing sensitive data

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start

# Run tests (when implemented)
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@sciencegames.com or open an issue in the repository.
