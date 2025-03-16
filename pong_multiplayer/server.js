// Multiplayer Pong Game Implementation
// This implementation uses Node.js with Express for the server and Socket.IO for real-time communication

// ----- SERVER SIDE (server.js) -----
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/pongGame', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wins: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

// Game Room Schema & Model
const gameRoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  host: { type: String, required: true },
  gameMode: { type: String, default: '1v1' }, // '1v1', '2v2', '2v1'
  maxRounds: { type: Number, default: 5 },
  players: [{
    socketId: String,
    username: String,
    team: Number, // 0 or 1
    position: Number, // 0 for top, 1 for bottom in team (for 2v2)
    paddleY: Number // Dynamic paddle position
  }],
  spectators: [String],
  gameState: {
    isActive: { type: Boolean, default: false },
    ballPosition: { x: Number, y: Number },
    ballVelocity: { x: Number, y: Number },
    score: [Number, Number],
    currentRound: { type: Number, default: 1 },
    roundWins: [Number, Number]
  }
});

const GameRoom = mongoose.model('GameRoom', gameRoomSchema);

// Authentication Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    
    // Generate token
    const token = jwt.sign({ username }, 'SECRET_KEY', { expiresIn: '24h' });
    
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ username }, 'SECRET_KEY', { expiresIn: '24h' });
    
    res.status(200).json({ message: 'Login successful', token, wins: user.wins, gamesPlayed: user.gamesPlayed });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Game Room Routes
app.post('/api/rooms', verifyToken, async (req, res) => {
  try {
    const { username } = req.user;
    const { gameMode, maxRounds } = req.body;
    
    // Generate a unique 6-digit room code
    let roomCode;
    let isUnique = false;
    
    while (!isUnique) {
      roomCode = Math.floor(100000 + Math.random() * 900000).toString();
      const existingRoom = await GameRoom.findOne({ roomCode });
      if (!existingRoom) isUnique = true;
    }
    
    // Create a new game room
    const newRoom = new GameRoom({
      roomCode,
      host: username,
      gameMode: gameMode || '1v1',
      maxRounds: maxRounds || 5,
      players: [{ username, team: 0, position: 0 }],
      gameState: {
        isActive: false,
        ballPosition: { x: 400, y: 300 },
        ballVelocity: { x: 0, y: 0 },
        score: [0, 0],
        currentRound: 1,
        roundWins: [0, 0]
      }
    });
    
    await newRoom.save();
    
    res.status(201).json({ message: 'Room created successfully', roomCode });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/rooms/:roomCode', verifyToken, async (req, res) => {
  try {
    const { roomCode } = req.params;
    
    const room = await GameRoom.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.status(200).json({ room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Socket.IO Implementation
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join Room
  socket.on('joinRoom', async ({ roomCode, username, token }) => {
    try {
      // Verify token
      const decoded = jwt.verify(token, 'SECRET_KEY');
      if (decoded.username !== username) {
        socket.emit('error', { message: 'Authentication failed' });
        return;
      }
      
      // Find room
      const room = await GameRoom.findOne({ roomCode });
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      
      // Join socket room
      socket.join(roomCode);
      
      // Check if player is rejoining
      const existingPlayerIndex = room.players.findIndex(p => p.username === username);
      
      if (existingPlayerIndex >= 0) {
        // Player is rejoining
        room.players[existingPlayerIndex].socketId = socket.id;
      } else {
        // New player joining
        const maxPlayersPerTeam = room.gameMode === '2v2' || room.gameMode === '2v1' ? 2 : 1;
        
        // Count players in each team
        const team0Count = room.players.filter(p => p.team === 0).length;
        const team1Count = room.players.filter(p => p.team === 1).length;
        
        // Determine which team to join
        let team = 0;
        let position = 0;
        
        if (room.gameMode === '2v1') {
          if (team0Count < 2) {
            team = 0;
            position = team0Count;
          } else if (team1Count < 1) {
            team = 1;
            position = 0;
          } else {
            // Room is full, join as spectator
            room.spectators.push(socket.id);
            await room.save();
            socket.emit('joinedAsSpectator', { room });
            io.to(roomCode).emit('roomUpdate', { room });
            return;
          }
        } else if (room.gameMode === '1v1') {
          if (team0Count < 1) {
            team = 0;
            position = 0;
          } else if (team1Count < 1) {
            team = 1;
            position = 0;
          } else {
            // Room is full, join as spectator
            room.spectators.push(socket.id);
            await room.save();
            socket.emit('joinedAsSpectator', { room });
            io.to(roomCode).emit('roomUpdate', { room });
            return;
          }
        } else { // 2v2
          if (team0Count < 2) {
            team = 0;
            position = team0Count;
          } else if (team1Count < 2) {
            team = 1;
            position = team1Count;
          } else {
            // Room is full, join as spectator
            room.spectators.push(socket.id);
            await room.save();
            socket.emit('joinedAsSpectator', { room });
            io.to(roomCode).emit('roomUpdate', { room });
            return;
          }
        }
        
        // Add player to room
        room.players.push({ socketId: socket.id, username, team, position });
      }
      
      await room.save();
      
      // Notify player joined successfully
      socket.emit('joinedRoom', { room });
      
      // Notify all clients in the room
      io.to(roomCode).emit('roomUpdate', { room });
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: 'Failed to join room', error: error.message });
    }
  });
  
  // Update Game Settings (Host Only)
  socket.on('updateGameSettings', async ({ roomCode, gameMode, maxRounds, token }) => {
    try {
      // Verify token
      const decoded = jwt.verify(token, 'SECRET_KEY');
      
      // Find room
      const room = await GameRoom.findOne({ roomCode });
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      
      // Check if request is from host
      if (room.host !== decoded.username) {
        socket.emit('error', { message: 'Only the host can update game settings' });
        return;
      }
      
      // Update settings
      if (gameMode) room.gameMode = gameMode;
      if (maxRounds) room.maxRounds = maxRounds;
      
      // Rearrange players if needed due to game mode change
      if (gameMode) {
        // Reset player positions based on new game mode
        const team0Players = room.players.filter(p => p.team === 0);
        const team1Players = room.players.filter(p => p.team === 1);
        
        // Convert all excessive players to spectators
        if (gameMode === '1v1') {
          if (team0Players.length > 1) {
            for (let i = 1; i < team0Players.length; i++) {
              room.spectators.push(team0Players[i].socketId);
            }
            team0Players.splice(1);
          }
          if (team1Players.length > 1) {
            for (let i = 1; i < team1Players.length; i++) {
              room.spectators.push(team1Players[i].socketId);
            }
            team1Players.splice(1);
          }
        } else if (gameMode === '2v1') {
          if (team0Players.length > 2) {
            for (let i = 2; i < team0Players.length; i++) {
              room.spectators.push(team0Players[i].socketId);
            }
            team0Players.splice(2);
          }
          if (team1Players.length > 1) {
            for (let i = 1; i < team1Players.length; i++) {
              room.spectators.push(team1Players[i].socketId);
            }
            team1Players.splice(1);
          }
        } else if (gameMode === '2v2') {
          if (team0Players.length > 2) {
            for (let i = 2; i < team0Players.length; i++) {
              room.spectators.push(team0Players[i].socketId);
            }
            team0Players.splice(2);
          }
          if (team1Players.length > 2) {
            for (let i = 2; i < team1Players.length; i++) {
              room.spectators.push(team1Players[i].socketId);
            }
            team1Players.splice(2);
          }
        }
        
        // Update positions
        team0Players.forEach((p, i) => { p.position = i; });
        team1Players.forEach((p, i) => { p.position = i; });
        
        // Update room players
        room.players = [...team0Players, ...team1Players];
      }
      
      await room.save();
      
      // Notify all clients in the room
      io.to(roomCode).emit('roomUpdate', { room });
    } catch (error) {
      console.error('Update settings error:', error);
      socket.emit('error', { message: 'Failed to update settings', error: error.message });
    }
  });
  
  // Kick Player (Host Only)
  socket.on('kickPlayer', async ({ roomCode, username, token }) => {
    try {
      // Verify token
      const decoded = jwt.verify(token, 'SECRET_KEY');
      
      // Find room
      const room = await GameRoom.findOne({ roomCode });
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      
      // Check if request is from host
      if (room.host !== decoded.username) {
        socket.emit('error', { message: 'Only the host can kick players' });
        return;
      }
      
      // Find player to kick
      const playerIndex = room.players.findIndex(p => p.username === username);
      if (playerIndex >= 0) {
        const kickedPlayerSocketId = room.players[playerIndex].socketId;
        
        // Remove player from room
        room.players.splice(playerIndex, 1);
        await room.save();
        
        // Notify kicked player
        io.to(kickedPlayerSocketId).emit('kicked', { message: 'You have been kicked from the room' });
        
        // Force disconnect from socket room
        const kickedSocket = io.sockets.sockets.get(kickedPlayerSocketId);
        if (kickedSocket) {
          kickedSocket.leave(roomCode);
        }
        
        // Notify all clients in the room
        io.to(roomCode).emit('roomUpdate', { room });
      }
    } catch (error) {
      console.error('Kick player error:', error);
      socket.emit('error', { message: 'Failed to kick player', error: error.message });
    }
  });
  
  // Start Game (Host Only)
  socket.on('startGame', async ({ roomCode, token }) => {
    try {
      // Verify token
      const decoded = jwt.verify(token, 'SECRET_KEY');
      
      // Find room
      const room = await GameRoom.findOne({ roomCode });
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      
      // Check if request is from host
      if (room.host !== decoded.username) {
        socket.emit('error', { message: 'Only the host can start the game' });
        return;
      }
      
      // Check if enough players to start
      if (room.gameMode === '1v1' && room.players.length < 2) {
        socket.emit('error', { message: 'Need at least 2 players to start 1v1 game' });
        return;
      } else if (room.gameMode === '2v1') {
        const team0Count = room.players.filter(p => p.team === 0).length;
        const team1Count = room.players.filter(p => p.team === 1).length;
        if (team0Count < 2 || team1Count < 1) {
          socket.emit('error', { message: 'Need at least 2 players on team 1 and 1 player on team 2' });
          return;
        }
      } else if (room.gameMode === '2v2') {
        const team0Count = room.players.filter(p => p.team === 0).length;
        const team1Count = room.players.filter(p => p.team === 1).length;
        if (team0Count < 2 || team1Count < 2) {
          socket.emit('error', { message: 'Need at least 2 players on each team' });
          return;
        }
      }
      
      // Initialize game state
      room.gameState.isActive = true;
      room.gameState.ballPosition = { x: 400, y: 300 };
      room.gameState.ballVelocity = { 
        x: Math.random() > 0.5 ? 5 : -5, 
        y: Math.random() * 6 - 3 
      };
      room.gameState.score = [0, 0];
      room.gameState.currentRound = 1;
      room.gameState.roundWins = [0, 0];
      
      await room.save();
      
      // Notify all clients in the room
      io.to(roomCode).emit('gameStarted', { room });
      
      // Start game loop
      startGameLoop(roomCode);
    } catch (error) {
      console.error('Start game error:', error);
      socket.emit('error', { message: 'Failed to start game', error: error.message });
    }
  });
  
  // Player Movement
  socket.on('playerMove', async ({ roomCode, direction, paddleY }) => {
    try {
      // Use cached room if available, otherwise fetch from database
      if (gameStateCache[roomCode]) {
        const cachedRoom = gameStateCache[roomCode];
        
        // Find player in cached room
        const playerIndex = cachedRoom.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex >= 0) {
          // Store paddle position in player object
          if (paddleY !== undefined) {
            cachedRoom.players[playerIndex].paddleY = paddleY;
          }
          
          // Broadcast movement to all clients
          io.to(roomCode).emit('playerMoved', { 
            socketId: socket.id,
            direction,
            paddleY,
            team: cachedRoom.players[playerIndex].team,
            position: cachedRoom.players[playerIndex].position
          });
        }
      } else {
        // Fall back to database if cache isn't available
        const room = await GameRoom.findOne({ roomCode });
        if (!room || !room.gameState.isActive) {
          return;
        }
        
        // Find player in room
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex >= 0) {
          io.to(roomCode).emit('playerMoved', { 
            socketId: socket.id,
            direction,
            paddleY
          });
        }
      }
    } catch (error) {
      console.error('Player move error:', error);
    }
  });
  
  // Handle Disconnections
  socket.on('disconnect', async () => {
    try {
      console.log('Client disconnected:', socket.id);
      
      // Find all rooms where this socket is a player
      const rooms = await GameRoom.find({
        'players.socketId': socket.id
      });
      
      for (const room of rooms) {
        // Find player in room
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        
        if (playerIndex >= 0) {
          // If host disconnects, assign new host or close room
          if (room.host === room.players[playerIndex].username) {
            if (room.players.length > 1) {
              // Assign new host (first non-disconnected player)
              const newHostIndex = room.players.findIndex(p => p.socketId !== socket.id);
              if (newHostIndex >= 0) {
                room.host = room.players[newHostIndex].username;
              }
            } else {
              // Last player, close room
              await GameRoom.deleteOne({ roomCode: room.roomCode });
              continue;
            }
          }
          
          // Keep player in room for reconnection
          // Just mark socketId as null
          room.players[playerIndex].socketId = null;
          
          await room.save();
          
          // Notify all clients in the room
          io.to(room.roomCode).emit('playerDisconnected', { 
            username: room.players[playerIndex].username,
            room
          });
        }
      }
      
      // Find all rooms where this socket is a spectator
      const spectatorRooms = await GameRoom.find({
        spectators: socket.id
      });
      
      for (const room of spectatorRooms) {
        // Remove spectator
        room.spectators = room.spectators.filter(id => id !== socket.id);
        await room.save();
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
});

// Game State Cache to avoid frequent database reads
const gameStateCache = {};

// Game Loop Function
const gameLoops = {};
let saveOperationInProgress = {};

function startGameLoop(roomCode) {
  // Clear any existing game loop
  if (gameLoops[roomCode]) {
    clearInterval(gameLoops[roomCode]);
  }
  
  const FPS = 30;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PADDLE_WIDTH = 20;
  const PADDLE_HEIGHT = 100;
  const BALL_RADIUS = 10;
  const BALL_SPEED_INCREASE = 0.2;
  const SAVE_FREQUENCY = 5; // Only save to DB every 5 frames
  
  let frameCount = 0;
  
  // Initialize save operation flag
  saveOperationInProgress[roomCode] = false;
  
  // Initial fetch of room data to cache
  GameRoom.findOne({ roomCode }).then(room => {
    if (room) {
      gameStateCache[roomCode] = {
        roomCode: room.roomCode,
        host: room.host,
        gameMode: room.gameMode,
        maxRounds: room.maxRounds,
        players: JSON.parse(JSON.stringify(room.players)),
        spectators: room.spectators ? [...room.spectators] : [],
        gameState: JSON.parse(JSON.stringify(room.gameState))
      };
    }
  }).catch(err => console.error('Initial room fetch error:', err));
  
  gameLoops[roomCode] = setInterval(async () => {
    try {
      // Use cached room state instead of fetching from DB every time
      const cachedRoom = gameStateCache[roomCode];
      
      if (!cachedRoom || !cachedRoom.gameState.isActive) {
        clearInterval(gameLoops[roomCode]);
        delete gameLoops[roomCode];
        delete gameStateCache[roomCode];
        return;
      }
      
      // Update ball position
      cachedRoom.gameState.ballPosition.x += cachedRoom.gameState.ballVelocity.x;
      cachedRoom.gameState.ballPosition.y += cachedRoom.gameState.ballVelocity.y;
      
      // Ball collision with top/bottom walls
      if (cachedRoom.gameState.ballPosition.y - BALL_RADIUS < 0) {
        cachedRoom.gameState.ballPosition.y = BALL_RADIUS; // Prevent ball from going outside
        cachedRoom.gameState.ballVelocity.y = Math.abs(cachedRoom.gameState.ballVelocity.y);
      } else if (cachedRoom.gameState.ballPosition.y + BALL_RADIUS > CANVAS_HEIGHT) {
        cachedRoom.gameState.ballPosition.y = CANVAS_HEIGHT - BALL_RADIUS; // Prevent ball from going outside
        cachedRoom.gameState.ballVelocity.y = -Math.abs(cachedRoom.gameState.ballVelocity.y);
      }
      
      // Ball collision with left paddle (team 0)
      const team0Players = cachedRoom.players.filter(p => p.team === 0);
      let team0Collision = false;
      
      for (const player of team0Players) {
        // Get dynamic paddle position from client or use default
        let paddleY;
        if (player.paddleY !== undefined) {
          paddleY = player.paddleY;
        } else {
          paddleY = player.position === 0 ? 
            CANVAS_HEIGHT / 4 - PADDLE_HEIGHT / 2 : 
            3 * CANVAS_HEIGHT / 4 - PADDLE_HEIGHT / 2;
        }
        
        // Check collision
        if (cachedRoom.gameState.ballPosition.x - BALL_RADIUS < PADDLE_WIDTH &&
            cachedRoom.gameState.ballPosition.x > 0 &&
            cachedRoom.gameState.ballPosition.y > paddleY &&
            cachedRoom.gameState.ballPosition.y < paddleY + PADDLE_HEIGHT &&
            cachedRoom.gameState.ballVelocity.x < 0) {
          team0Collision = true;
          break;
        }
      }
      
      if (team0Collision) {
        cachedRoom.gameState.ballPosition.x = PADDLE_WIDTH + BALL_RADIUS; // Prevent ball from going inside paddle
        cachedRoom.gameState.ballVelocity.x = Math.abs(cachedRoom.gameState.ballVelocity.x);
        cachedRoom.gameState.ballVelocity.x += BALL_SPEED_INCREASE;
        
        // Add angle based on where the ball hit the paddle
        let hitPosition = 0.5; // Default to middle
        for (const player of team0Players) {
          let paddleY = player.paddleY !== undefined ? player.paddleY : 
            (player.position === 0 ? CANVAS_HEIGHT / 4 - PADDLE_HEIGHT / 2 : 3 * CANVAS_HEIGHT / 4 - PADDLE_HEIGHT / 2);
          
          if (cachedRoom.gameState.ballPosition.y >= paddleY && 
              cachedRoom.gameState.ballPosition.y <= paddleY + PADDLE_HEIGHT) {
            hitPosition = (cachedRoom.gameState.ballPosition.y - paddleY) / PADDLE_HEIGHT;
            break;
          }
        }
        
        // Apply angle based on hit position (0 = top, 0.5 = middle, 1 = bottom)
        cachedRoom.gameState.ballVelocity.y = 10 * (hitPosition - 0.5);
      }
      
      // Ball collision with right paddle (team 1)
      const team1Players = cachedRoom.players.filter(p => p.team === 1);
      let team1Collision = false;
      
      for (const player of team1Players) {
        // Get dynamic paddle position from client or use default
        let paddleY;
        if (player.paddleY !== undefined) {
          paddleY = player.paddleY;
        } else {
          paddleY = player.position === 0 ? 
            CANVAS_HEIGHT / 4 - PADDLE_HEIGHT / 2 : 
            3 * CANVAS_HEIGHT / 4 - PADDLE_HEIGHT / 2;
        }
        
        // Check collision
        if (cachedRoom.gameState.ballPosition.x + BALL_RADIUS > CANVAS_WIDTH - PADDLE_WIDTH &&
            cachedRoom.gameState.ballPosition.x < CANVAS_WIDTH &&
            cachedRoom.gameState.ballPosition.y > paddleY &&
            cachedRoom.gameState.ballPosition.y < paddleY + PADDLE_HEIGHT &&
            cachedRoom.gameState.ballVelocity.x > 0) {
          team1Collision = true;
          break;
        }
      }
      
      if (team1Collision) {
        cachedRoom.gameState.ballPosition.x = CANVAS_WIDTH - PADDLE_WIDTH - BALL_RADIUS; // Prevent ball from going inside paddle
        cachedRoom.gameState.ballVelocity.x = -Math.abs(cachedRoom.gameState.ballVelocity.x);
        cachedRoom.gameState.ballVelocity.x -= BALL_SPEED_INCREASE;
        
        // Add angle based on where the ball hit the paddle
        let hitPosition = 0.5; // Default to middle
        for (const player of team1Players) {
          let paddleY = player.paddleY !== undefined ? player.paddleY : 
            (player.position === 0 ? CANVAS_HEIGHT / 4 - PADDLE_HEIGHT / 2 : 3 * CANVAS_HEIGHT / 4 - PADDLE_HEIGHT / 2);
          
          if (cachedRoom.gameState.ballPosition.y >= paddleY && 
              cachedRoom.gameState.ballPosition.y <= paddleY + PADDLE_HEIGHT) {
            hitPosition = (cachedRoom.gameState.ballPosition.y - paddleY) / PADDLE_HEIGHT;
            break;
          }
        }
        
        // Apply angle based on hit position (0 = top, 0.5 = middle, 1 = bottom)
        cachedRoom.gameState.ballVelocity.y = 10 * (hitPosition - 0.5);
      }
      
      // Cap ball velocity to prevent extreme speeds
      const maxSpeed = 15;
      if (Math.abs(cachedRoom.gameState.ballVelocity.x) > maxSpeed) {
        cachedRoom.gameState.ballVelocity.x = Math.sign(cachedRoom.gameState.ballVelocity.x) * maxSpeed;
      }
      if (Math.abs(cachedRoom.gameState.ballVelocity.y) > maxSpeed) {
        cachedRoom.gameState.ballVelocity.y = Math.sign(cachedRoom.gameState.ballVelocity.y) * maxSpeed;
      }
      
      // Ball out of bounds (scoring)
      let scoreChanged = false;
      if (cachedRoom.gameState.ballPosition.x < 0) {
        // Team 1 scores
        cachedRoom.gameState.score[1]++;
        resetBall(cachedRoom, -1);
        scoreChanged = true;
      } else if (cachedRoom.gameState.ballPosition.x > CANVAS_WIDTH) {
        // Team 0 scores
        cachedRoom.gameState.score[0]++;
        resetBall(cachedRoom, 1);
        scoreChanged = true;
      }
      
      // Send game state update to all clients
      io.to(roomCode).emit('gameStateUpdate', { 
        gameState: cachedRoom.gameState 
      });
      
      // Check if round is over (3 points)
      if (cachedRoom.gameState.score[0] >= 3) {
        // Team 0 wins the round
        cachedRoom.gameState.roundWins[0]++;
        await endRound(cachedRoom, 0);
        return; // End this iteration of the game loop
      } else if (cachedRoom.gameState.score[1] >= 3) {
        // Team 1 wins the round
        cachedRoom.gameState.roundWins[1]++;
        await endRound(cachedRoom, 1);
        return; // End this iteration of the game loop
      }
      
      // Check if game is over (max rounds reached)
      if (cachedRoom.gameState.currentRound > cachedRoom.maxRounds || 
          Math.max(...cachedRoom.gameState.roundWins) > Math.floor(cachedRoom.maxRounds / 2)) {
        // End game
        await endGame(cachedRoom);
        return; // End this iteration of the game loop
      }
      
      // Only save to database periodically or when score changes to avoid parallel save errors
      frameCount++;
      if ((frameCount % SAVE_FREQUENCY === 0 || scoreChanged) && !saveOperationInProgress[roomCode]) {
        saveOperationInProgress[roomCode] = true;
        
        try {
          const room = await GameRoom.findOne({ roomCode });
          if (room) {
            // Update the database with the current game state
            room.gameState = JSON.parse(JSON.stringify(cachedRoom.gameState));
            
            // Update player paddle positions
            for (const cachedPlayer of cachedRoom.players) {
              if (cachedPlayer.paddleY !== undefined) {
                const dbPlayer = room.players.find(p => 
                  p.username === cachedPlayer.username && 
                  p.team === cachedPlayer.team && 
                  p.position === cachedPlayer.position
                );
                if (dbPlayer) {
                  dbPlayer.paddleY = cachedPlayer.paddleY;
                }
              }
            }
            
            await room.save();
          }
        } catch (error) {
          console.error(`Game state save error for room ${roomCode}:`, error);
        } finally {
          saveOperationInProgress[roomCode] = false;
        }
      }
      
    } catch (error) {
      console.error(`Game loop error for room ${roomCode}:`, error);
      if (!saveOperationInProgress[roomCode]) {
        saveOperationInProgress[roomCode] = false;
      }
    }
  }, 1000 / FPS);
}

function resetBall(room, direction) {
  room.gameState.ballPosition = { x: 400, y: 300 };
  room.gameState.ballVelocity = { 
    x: direction * 5, 
    y: Math.random() * 6 - 3 
  };
}

async function endRound(cachedRoom, winningTeam) {
  // Reset score and ball for next round
  cachedRoom.gameState.score = [0, 0];
  cachedRoom.gameState.currentRound++;
  resetBall(cachedRoom, winningTeam === 0 ? -1 : 1);
  
  // Save to database (being careful to prevent parallel saves)
  if (!saveOperationInProgress[cachedRoom.roomCode]) {
    saveOperationInProgress[cachedRoom.roomCode] = true;
    try {
      const room = await GameRoom.findOne({ roomCode: cachedRoom.roomCode });
      if (room) {
        room.gameState.score = [0, 0];
        room.gameState.currentRound = cachedRoom.gameState.currentRound;
        room.gameState.roundWins = [...cachedRoom.gameState.roundWins];
        room.gameState.ballPosition = { ...cachedRoom.gameState.ballPosition };
        room.gameState.ballVelocity = { ...cachedRoom.gameState.ballVelocity };
        await room.save();
      }
    } catch (error) {
      console.error(`End round save error for room ${cachedRoom.roomCode}:`, error);
    } finally {
      saveOperationInProgress[cachedRoom.roomCode] = false;
    }
  }
  
  // Notify all clients in the room
  io.to(cachedRoom.roomCode).emit('roundEnded', { 
    winningTeam,
    roundWins: cachedRoom.gameState.roundWins,
    currentRound: cachedRoom.gameState.currentRound
  });
  
  // Pause briefly between rounds
  io.to(cachedRoom.roomCode).emit('gamePaused', { 
    message: `Round ${cachedRoom.gameState.currentRound - 1} ended. Team ${winningTeam + 1} wins!`,
    countdown: 3
  });
  
  // Clear interval during pause
  clearInterval(gameLoops[cachedRoom.roomCode]);
  
  // Resume game after countdown
  setTimeout(() => {
    io.to(cachedRoom.roomCode).emit('gameResumed', { message: 'Game resumed' });
    
    // Only restart game if it's still active
    if (cachedRoom.gameState.isActive) {
      startGameLoop(cachedRoom.roomCode);
    }
  }, 3000);
}

async function endGame(cachedRoom) {
  // Determine winner
  const winningTeam = cachedRoom.gameState.roundWins[0] > cachedRoom.gameState.roundWins[1] ? 0 : 1;
  
  // Mark game as inactive in cache
  cachedRoom.gameState.isActive = false;
  
  // Save final state to database
  if (!saveOperationInProgress[cachedRoom.roomCode]) {
    saveOperationInProgress[cachedRoom.roomCode] = true;
    try {
      const room = await GameRoom.findOne({ roomCode: cachedRoom.roomCode });
      if (room) {
        room.gameState.isActive = false;
        room.gameState.roundWins = [...cachedRoom.gameState.roundWins];
        await room.save();
      }
    } catch (error) {
      console.error(`End game save error for room ${cachedRoom.roomCode}:`, error);
    } finally {
      saveOperationInProgress[cachedRoom.roomCode] = false;
    }
  }
  
  // Update wins for players (do this sequentially to avoid race conditions)
  const winningPlayers = cachedRoom.players.filter(p => p.team === winningTeam).map(p => p.username);
  
  for (const username of winningPlayers) {
    try {
      await User.findOneAndUpdate(
        { username },
        { $inc: { wins: 1, gamesPlayed: 1 } }
      );
    } catch (error) {
      console.error(`Failed to update win for player ${username}:`, error);
    }
  }
  
  // Update gamesPlayed for losing players
  const losingPlayers = cachedRoom.players.filter(p => p.team !== winningTeam).map(p => p.username);
  
  for (const username of losingPlayers) {
    try {
      await User.findOneAndUpdate(
        { username },
        { $inc: { gamesPlayed: 1 } }
      );
    } catch (error) {
      console.error(`Failed to update gamesPlayed for player ${username}:`, error);
    }
  }
  
  // Notify all clients in the room
  io.to(cachedRoom.roomCode).emit('gameEnded', { 
    winningTeam,
    roundWins: cachedRoom.gameState.roundWins,
    winningPlayers
  });
  
  // Clear game loop
  clearInterval(gameLoops[cachedRoom.roomCode]);
  delete gameLoops[cachedRoom.roomCode];
  
  // Clean up
  setTimeout(() => {
    delete gameStateCache[cachedRoom.roomCode];
    delete saveOperationInProgress[cachedRoom.roomCode];
  }, 5000);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
