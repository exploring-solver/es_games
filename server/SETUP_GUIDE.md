# Quick Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd /home/user/es_games/server
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Required Environment Variables:**
```env
MONGODB_URI=mongodb://localhost:27017/science_games
JWT_SECRET=your_very_secure_random_string_here
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: MongoDB Atlas**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update MONGODB_URI in .env

### 4. Run the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on http://localhost:3000

### 5. Test the Server

```bash
# Test health endpoint
curl http://localhost:3000/health

# Expected response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## API Testing with Postman/Thunder Client

### 1. Register a User

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Save the `token` from the response!

### 3. Get Current User (Protected Route)

```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Create a Game (Admin Only)

First, manually update a user to admin in MongoDB:
```javascript
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

Then:
```http
POST http://localhost:3000/api/games
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Physics Puzzle",
  "description": "A fun physics-based puzzle game",
  "category": "physics",
  "difficulty": "medium"
}
```

### 5. Submit a Score

```http
POST http://localhost:3000/api/scores
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "gameId": "GAME_ID_FROM_STEP_4",
  "score": 1500,
  "details": {
    "accuracy": 95,
    "timeCompleted": 120,
    "correctAnswers": 19,
    "totalQuestions": 20
  },
  "gameMode": "single-player"
}
```

## Socket.io Testing

Use a Socket.io client or browser console:

```javascript
// Connect to server
const socket = io('http://localhost:3000');

// Authenticate
socket.emit('authenticate', 'YOUR_JWT_TOKEN');

socket.on('authenticated', (data) => {
  console.log('Authenticated:', data);
});

// Create a room
socket.emit('create-room', {
  gameId: 'GAME_ID_HERE',
  settings: {
    maxPlayers: 4,
    isPrivate: false,
    matchType: 'casual'
  }
});

socket.on('room-created', (data) => {
  console.log('Room created:', data);
});
```

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Solution:**
- Check if MongoDB is running: `systemctl status mongod`
- Verify MONGODB_URI in .env
- Check network connectivity for MongoDB Atlas

### Issue: JWT Authentication Failed

**Solution:**
- Ensure JWT_SECRET is set in .env
- Check token format: `Bearer TOKEN`
- Verify token hasn't expired

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 PID

# Or change PORT in .env
```

### Issue: CORS Error

**Solution:**
- Update CORS_ORIGIN in .env to match your frontend URL
- For development: `CORS_ORIGIN=http://localhost:5173`
- For production: `CORS_ORIGIN=https://yourdomain.com`

## Project Structure Overview

```
server/
├── config/          # Configuration files (DB connection)
├── controllers/     # Business logic for routes
├── middleware/      # Authentication, validation, error handling
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── socket/          # Socket.io handlers (rooms, matchmaking)
├── utils/           # Helper functions (leaderboard, achievements)
├── server.js        # Main server file
├── package.json     # Dependencies
└── .env            # Environment variables (create from .env.example)
```

## Next Steps

1. **Seed the Database**: Create initial games and achievements
2. **Test All Endpoints**: Use the API documentation in README.md
3. **Set Up Frontend**: Connect your React/Vue/Angular frontend
4. **Configure Production**: Set up proper production environment
5. **Deploy**: Deploy to Heroku, DigitalOcean, AWS, etc.

## Available NPM Scripts

- `npm start` - Start server in production mode
- `npm run dev` - Start server in development mode with nodemon
- `npm test` - Run tests (when implemented)

## Support

If you encounter any issues:
1. Check the logs in the terminal
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check the README.md for detailed API documentation

## Security Checklist Before Production

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV to 'production'
- [ ] Update CORS_ORIGIN to your production domain
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS
- [ ] Set up rate limiting (already configured)
- [ ] Review and adjust security headers
- [ ] Set up proper logging
- [ ] Configure MongoDB authentication
- [ ] Set up backup strategy for database

---

**Server is now ready to use!** 🚀

For detailed API documentation, see [README.md](./README.md)
