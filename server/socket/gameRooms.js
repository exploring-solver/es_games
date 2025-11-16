const jwt = require('jsonwebtoken');
const Match = require('../models/Match');
const User = require('../models/User');

class GameRoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomId -> room data
    this.userSockets = new Map(); // userId -> socketId
    this.socketUsers = new Map(); // socketId -> userId
  }

  // Initialize Socket.io event handlers
  init() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Authenticate socket connection
      socket.on('authenticate', async (token) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id);

          if (user) {
            socket.userId = user._id.toString();
            socket.username = user.username;
            socket.avatar = user.avatar;

            this.userSockets.set(socket.userId, socket.id);
            this.socketUsers.set(socket.id, socket.userId);

            // Update user online status
            user.isOnline = true;
            await user.save();

            socket.emit('authenticated', {
              userId: user._id,
              username: user.username
            });

            console.log(`User authenticated: ${user.username}`);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('auth-error', { message: 'Authentication failed' });
        }
      });

      // Create a game room
      socket.on('create-room', async (data) => {
        try {
          if (!socket.userId) {
            return socket.emit('error', { message: 'Not authenticated' });
          }

          const { gameId, settings } = data;
          const roomId = Match.generateRoomId();

          // Create match in database
          const match = await Match.create({
            game: gameId,
            roomId,
            host: socket.userId,
            settings,
            players: [{
              user: socket.userId,
              username: socket.username,
              avatar: socket.avatar
            }]
          });

          await match.populate('game', 'name thumbnail maxPlayers');

          // Create room in memory
          const room = {
            roomId,
            matchId: match._id,
            gameId,
            host: socket.userId,
            players: new Map([[socket.userId, {
              socketId: socket.id,
              username: socket.username,
              avatar: socket.avatar,
              isReady: false
            }]]),
            status: 'waiting',
            gameState: {}
          };

          this.rooms.set(roomId, room);

          // Join socket.io room
          socket.join(roomId);
          socket.currentRoom = roomId;

          socket.emit('room-created', {
            roomId,
            match
          });

          console.log(`Room created: ${roomId} by ${socket.username}`);
        } catch (error) {
          console.error('Create room error:', error);
          socket.emit('error', { message: 'Failed to create room' });
        }
      });

      // Join a game room
      socket.on('join-room', async (data) => {
        try {
          if (!socket.userId) {
            return socket.emit('error', { message: 'Not authenticated' });
          }

          const { roomId } = data;
          const match = await Match.findOne({ roomId });

          if (!match) {
            return socket.emit('error', { message: 'Room not found' });
          }

          if (match.isFull()) {
            return socket.emit('error', { message: 'Room is full' });
          }

          if (match.status !== 'waiting') {
            return socket.emit('error', { message: 'Game already started' });
          }

          // Add player to match
          const user = await User.findById(socket.userId);
          match.addPlayer(user);
          await match.save();

          // Update room in memory
          let room = this.rooms.get(roomId);
          if (!room) {
            room = {
              roomId,
              matchId: match._id,
              gameId: match.game,
              host: match.host.toString(),
              players: new Map(),
              status: match.status,
              gameState: {}
            };
            this.rooms.set(roomId, room);
          }

          room.players.set(socket.userId, {
            socketId: socket.id,
            username: socket.username,
            avatar: socket.avatar,
            isReady: false
          });

          // Join socket.io room
          socket.join(roomId);
          socket.currentRoom = roomId;

          // Notify room
          socket.emit('joined-room', {
            roomId,
            match
          });

          this.io.to(roomId).emit('player-joined', {
            userId: socket.userId,
            username: socket.username,
            avatar: socket.avatar,
            players: Array.from(room.players.values()).map(p => ({
              username: p.username,
              avatar: p.avatar,
              isReady: p.isReady
            }))
          });

          console.log(`${socket.username} joined room: ${roomId}`);
        } catch (error) {
          console.error('Join room error:', error);
          socket.emit('error', { message: error.message || 'Failed to join room' });
        }
      });

      // Leave room
      socket.on('leave-room', async () => {
        await this.handleLeaveRoom(socket);
      });

      // Toggle ready status
      socket.on('toggle-ready', async () => {
        try {
          const roomId = socket.currentRoom;
          if (!roomId) return;

          const room = this.rooms.get(roomId);
          if (!room) return;

          const player = room.players.get(socket.userId);
          if (player) {
            player.isReady = !player.isReady;

            // Update match in database
            const match = await Match.findById(room.matchId);
            const matchPlayer = match.players.find(p => p.user.toString() === socket.userId);
            if (matchPlayer) {
              matchPlayer.isReady = player.isReady;
              await match.save();
            }

            this.io.to(roomId).emit('player-ready-changed', {
              userId: socket.userId,
              username: socket.username,
              isReady: player.isReady,
              players: Array.from(room.players.values()).map(p => ({
                username: p.username,
                avatar: p.avatar,
                isReady: p.isReady
              }))
            });
          }
        } catch (error) {
          console.error('Toggle ready error:', error);
        }
      });

      // Start game
      socket.on('start-game', async () => {
        try {
          const roomId = socket.currentRoom;
          if (!roomId) return;

          const room = this.rooms.get(roomId);
          if (!room) return;

          // Only host can start
          if (room.host !== socket.userId) {
            return socket.emit('error', { message: 'Only host can start the game' });
          }

          // Check if all players are ready
          const allReady = Array.from(room.players.values()).every(p => p.isReady);
          if (!allReady) {
            return socket.emit('error', { message: 'Not all players are ready' });
          }

          // Update match
          const match = await Match.findById(room.matchId);
          match.start();
          await match.save();

          room.status = 'in-progress';

          this.io.to(roomId).emit('game-started', {
            roomId,
            startTime: match.startedAt
          });

          console.log(`Game started in room: ${roomId}`);
        } catch (error) {
          console.error('Start game error:', error);
          socket.emit('error', { message: error.message || 'Failed to start game' });
        }
      });

      // Game state update (during gameplay)
      socket.on('game-state', (data) => {
        const roomId = socket.currentRoom;
        if (!roomId) return;

        const room = this.rooms.get(roomId);
        if (!room || room.status !== 'in-progress') return;

        // Update game state
        room.gameState[socket.userId] = data;

        // Broadcast to other players in room
        socket.to(roomId).emit('player-state-update', {
          userId: socket.userId,
          username: socket.username,
          state: data
        });
      });

      // Player action (for real-time game events)
      socket.on('player-action', (data) => {
        const roomId = socket.currentRoom;
        if (!roomId) return;

        socket.to(roomId).emit('player-action', {
          userId: socket.userId,
          username: socket.username,
          action: data
        });
      });

      // Chat message
      socket.on('chat-message', async (data) => {
        try {
          const roomId = socket.currentRoom;
          if (!roomId) return;

          const { message } = data;

          // Save to match
          const match = await Match.findOne({ roomId });
          if (match) {
            match.chat.push({
              user: socket.userId,
              username: socket.username,
              message,
              timestamp: new Date()
            });
            await match.save();
          }

          this.io.to(roomId).emit('chat-message', {
            userId: socket.userId,
            username: socket.username,
            message,
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Chat message error:', error);
        }
      });

      // End game
      socket.on('end-game', async (data) => {
        try {
          const roomId = socket.currentRoom;
          if (!roomId) return;

          const room = this.rooms.get(roomId);
          if (!room) return;

          // Only host can end game
          if (room.host !== socket.userId) {
            return socket.emit('error', { message: 'Only host can end the game' });
          }

          const { results } = data;

          // Update match
          const match = await Match.findById(room.matchId);
          match.complete(results);
          await match.save();

          room.status = 'completed';

          this.io.to(roomId).emit('game-ended', {
            results,
            winner: match.winner
          });

          console.log(`Game ended in room: ${roomId}`);

          // Clean up room after a delay
          setTimeout(() => {
            this.cleanupRoom(roomId);
          }, 30000); // 30 seconds
        } catch (error) {
          console.error('End game error:', error);
          socket.emit('error', { message: 'Failed to end game' });
        }
      });

      // Disconnect
      socket.on('disconnect', async () => {
        console.log(`Client disconnected: ${socket.id}`);

        const userId = this.socketUsers.get(socket.id);
        if (userId) {
          // Update user online status
          try {
            const user = await User.findById(userId);
            if (user) {
              user.isOnline = false;
              user.lastSeen = new Date();
              await user.save();
            }
          } catch (error) {
            console.error('Error updating user status:', error);
          }

          this.userSockets.delete(userId);
          this.socketUsers.delete(socket.id);
        }

        // Handle room cleanup
        await this.handleLeaveRoom(socket);
      });
    });
  }

  // Handle player leaving room
  async handleLeaveRoom(socket) {
    try {
      const roomId = socket.currentRoom;
      if (!roomId) return;

      const room = this.rooms.get(roomId);
      if (!room) return;

      // Remove player from room
      room.players.delete(socket.userId);

      // Update match
      const match = await Match.findById(room.matchId);
      if (match && match.status === 'waiting') {
        match.removePlayer(socket.userId);
        await match.save();

        // If room is empty or match is cancelled, clean up
        if (match.status === 'cancelled' || room.players.size === 0) {
          this.cleanupRoom(roomId);
        } else {
          // Notify remaining players
          this.io.to(roomId).emit('player-left', {
            userId: socket.userId,
            username: socket.username,
            players: Array.from(room.players.values()).map(p => ({
              username: p.username,
              avatar: p.avatar,
              isReady: p.isReady
            })),
            newHost: match.host.toString()
          });

          // Update host if needed
          room.host = match.host.toString();
        }
      }

      socket.leave(roomId);
      socket.currentRoom = null;

      socket.emit('left-room', { roomId });

      console.log(`${socket.username} left room: ${roomId}`);
    } catch (error) {
      console.error('Leave room error:', error);
    }
  }

  // Clean up room
  cleanupRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      // Notify all players
      this.io.to(roomId).emit('room-closed', { roomId });

      // Remove all sockets from room
      this.io.in(roomId).socketsLeave(roomId);

      // Delete room
      this.rooms.delete(roomId);

      console.log(`Room cleaned up: ${roomId}`);
    }
  }

  // Get active rooms
  getActiveRooms() {
    return Array.from(this.rooms.values()).map(room => ({
      roomId: room.roomId,
      gameId: room.gameId,
      playerCount: room.players.size,
      status: room.status
    }));
  }
}

module.exports = GameRoomManager;
