const Match = require('../models/Match');
const Game = require('../models/Game');
const User = require('../models/User');

class MatchmakingService {
  constructor() {
    this.queue = new Map(); // gameId -> array of players
    this.playerQueue = new Map(); // userId -> queue data
  }

  // Add player to matchmaking queue
  async addToQueue(userId, gameId, preferences = {}) {
    try {
      // Check if player is already in queue
      if (this.playerQueue.has(userId)) {
        throw new Error('Player already in matchmaking queue');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const game = await Game.findById(gameId);
      if (!game) {
        throw new Error('Game not found');
      }

      const queueEntry = {
        userId,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        gameId,
        preferences: {
          matchType: preferences.matchType || 'casual',
          skillRange: preferences.skillRange || 10, // Level range for matchmaking
          region: preferences.region || 'any'
        },
        joinedAt: new Date()
      };

      // Add to game-specific queue
      if (!this.queue.has(gameId)) {
        this.queue.set(gameId, []);
      }
      this.queue.get(gameId).push(queueEntry);

      // Add to player queue map
      this.playerQueue.set(userId, queueEntry);

      console.log(`Player ${user.username} added to matchmaking queue for game ${gameId}`);

      // Try to find a match
      const match = await this.findMatch(queueEntry);

      return {
        success: true,
        inQueue: true,
        position: this.queue.get(gameId).length,
        match: match || null
      };
    } catch (error) {
      throw error;
    }
  }

  // Remove player from queue
  removeFromQueue(userId) {
    const queueEntry = this.playerQueue.get(userId);

    if (!queueEntry) {
      return false;
    }

    const { gameId } = queueEntry;

    // Remove from game queue
    if (this.queue.has(gameId)) {
      const gameQueue = this.queue.get(gameId);
      const index = gameQueue.findIndex(entry => entry.userId === userId);
      if (index !== -1) {
        gameQueue.splice(index, 1);
      }

      // Clean up empty queues
      if (gameQueue.length === 0) {
        this.queue.delete(gameId);
      }
    }

    // Remove from player queue map
    this.playerQueue.delete(userId);

    console.log(`Player removed from matchmaking queue: ${userId}`);

    return true;
  }

  // Find a match for a player
  async findMatch(queueEntry) {
    const { userId, gameId, level, preferences } = queueEntry;

    try {
      const game = await Game.findById(gameId);
      if (!game) return null;

      const gameQueue = this.queue.get(gameId);
      if (!gameQueue || gameQueue.length < game.minPlayers) {
        return null; // Not enough players
      }

      // Find compatible players based on preferences
      const compatiblePlayers = gameQueue.filter(entry => {
        // Don't match with self
        if (entry.userId === userId) return false;

        // Check match type
        if (entry.preferences.matchType !== preferences.matchType) return false;

        // Check skill level (within range)
        const levelDiff = Math.abs(entry.level - level);
        if (levelDiff > preferences.skillRange) return false;

        // Check region if specified
        if (preferences.region !== 'any' && entry.preferences.region !== 'any') {
          if (entry.preferences.region !== preferences.region) return false;
        }

        return true;
      });

      // Need at least minPlayers (including current player) for a match
      if (compatiblePlayers.length + 1 < game.minPlayers) {
        return null;
      }

      // Create match with available players (up to maxPlayers)
      const playersForMatch = [queueEntry, ...compatiblePlayers.slice(0, game.maxPlayers - 1)];

      // Remove matched players from queue
      for (const player of playersForMatch) {
        this.removeFromQueue(player.userId);
      }

      // Create the match
      const match = await this.createMatch(gameId, playersForMatch, preferences.matchType);

      console.log(`Match found! Room ID: ${match.roomId}`);

      return match;
    } catch (error) {
      console.error('Error finding match:', error);
      return null;
    }
  }

  // Create a match from matched players
  async createMatch(gameId, players, matchType) {
    try {
      const roomId = Match.generateRoomId();
      const host = players[0].userId;

      const match = await Match.create({
        game: gameId,
        roomId,
        host,
        matchType,
        settings: {
          isPrivate: false,
          matchType
        },
        players: players.map(p => ({
          user: p.userId,
          username: p.username,
          avatar: p.avatar,
          joinedAt: new Date(),
          isReady: true // Auto-ready for matchmaking
        }))
      });

      await match.populate('game', 'name thumbnail maxPlayers');

      return match;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  // Get queue status for a game
  getQueueStatus(gameId) {
    const gameQueue = this.queue.get(gameId);

    if (!gameQueue) {
      return {
        playersInQueue: 0,
        estimatedWaitTime: 0
      };
    }

    return {
      playersInQueue: gameQueue.length,
      estimatedWaitTime: this.estimateWaitTime(gameQueue.length),
      queuedPlayers: gameQueue.map(p => ({
        username: p.username,
        level: p.level,
        joinedAt: p.joinedAt
      }))
    };
  }

  // Get player's queue status
  getPlayerQueueStatus(userId) {
    const queueEntry = this.playerQueue.get(userId);

    if (!queueEntry) {
      return null;
    }

    const gameQueue = this.queue.get(queueEntry.gameId);
    const position = gameQueue ? gameQueue.findIndex(e => e.userId === userId) + 1 : 0;

    return {
      gameId: queueEntry.gameId,
      position,
      totalInQueue: gameQueue ? gameQueue.length : 0,
      joinedAt: queueEntry.joinedAt,
      estimatedWaitTime: this.estimateWaitTime(gameQueue ? gameQueue.length : 0)
    };
  }

  // Estimate wait time based on queue size
  estimateWaitTime(queueSize) {
    // Simple estimation: average 30 seconds per player group
    const avgMatchSize = 4;
    const avgMatchTime = 30; // seconds

    return Math.ceil((queueSize / avgMatchSize) * avgMatchTime);
  }

  // Quick match - find any available match or create one
  async quickMatch(userId, gameId) {
    try {
      // First, try to find an existing waiting match
      const availableMatches = await Match.findAvailableMatches(gameId, 'casual');

      for (const match of availableMatches) {
        if (!match.isFull()) {
          // Try to join this match
          const user = await User.findById(userId);
          match.addPlayer(user);
          await match.save();

          return {
            success: true,
            match,
            joined: true
          };
        }
      }

      // If no available match, add to matchmaking queue
      return await this.addToQueue(userId, gameId, { matchType: 'casual' });
    } catch (error) {
      throw error;
    }
  }

  // Ranked matchmaking with stricter skill matching
  async rankedMatch(userId, gameId) {
    const user = await User.findById(userId);

    return await this.addToQueue(userId, gameId, {
      matchType: 'ranked',
      skillRange: 5, // Stricter level range
      region: 'any'
    });
  }

  // Clear old queue entries (for cleanup/maintenance)
  clearOldEntries(maxAge = 300000) { // 5 minutes default
    const now = new Date();

    for (const [gameId, gameQueue] of this.queue.entries()) {
      const filtered = gameQueue.filter(entry => {
        const age = now - entry.joinedAt;
        if (age > maxAge) {
          this.playerQueue.delete(entry.userId);
          return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        this.queue.delete(gameId);
      } else {
        this.queue.set(gameId, filtered);
      }
    }
  }

  // Get all active queues
  getAllQueues() {
    const queues = [];

    for (const [gameId, gameQueue] of this.queue.entries()) {
      queues.push({
        gameId,
        playersInQueue: gameQueue.length,
        players: gameQueue.map(p => ({
          username: p.username,
          level: p.level,
          joinedAt: p.joinedAt
        }))
      });
    }

    return queues;
  }
}

module.exports = MatchmakingService;
