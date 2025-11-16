const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: String,
    avatar: String,
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isReady: {
      type: Boolean,
      default: false
    },
    team: {
      type: String,
      enum: ['red', 'blue', 'green', 'yellow', 'none'],
      default: 'none'
    }
  }],
  status: {
    type: String,
    enum: ['waiting', 'starting', 'in-progress', 'paused', 'completed', 'cancelled'],
    default: 'waiting'
  },
  matchType: {
    type: String,
    enum: ['casual', 'ranked', 'tournament', 'private'],
    default: 'casual'
  },
  settings: {
    maxPlayers: { type: Number, default: 4 },
    isPrivate: { type: Boolean, default: false },
    password: { type: String, select: false },
    allowSpectators: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 300 },
    customRules: mongoose.Schema.Types.Mixed
  },
  results: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    rank: Number,
    stats: {
      accuracy: Number,
      correctAnswers: Number,
      totalQuestions: Number,
      timeCompleted: Number
    }
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startedAt: Date,
  completedAt: Date,
  duration: Number, // in seconds
  spectators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  chat: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  events: [{
    type: {
      type: String,
      enum: ['player-joined', 'player-left', 'game-started', 'game-paused', 'game-resumed', 'game-ended']
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    data: mongoose.Schema.Types.Mixed
  }],
  metadata: {
    serverRegion: String,
    version: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
matchSchema.index({ roomId: 1 });
matchSchema.index({ status: 1, game: 1 });
matchSchema.index({ host: 1 });
matchSchema.index({ 'players.user': 1 });

// Generate unique room ID
matchSchema.statics.generateRoomId = function() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Check if match is full
matchSchema.methods.isFull = function() {
  return this.players.length >= this.settings.maxPlayers;
};

// Add player to match
matchSchema.methods.addPlayer = function(user) {
  if (this.isFull()) {
    throw new Error('Match is full');
  }

  const playerExists = this.players.some(p => p.user.toString() === user._id.toString());
  if (playerExists) {
    throw new Error('Player already in match');
  }

  this.players.push({
    user: user._id,
    username: user.username,
    avatar: user.avatar,
    joinedAt: new Date()
  });

  this.events.push({
    type: 'player-joined',
    player: user._id,
    timestamp: new Date()
  });
};

// Remove player from match
matchSchema.methods.removePlayer = function(userId) {
  const index = this.players.findIndex(p => p.user.toString() === userId.toString());
  if (index === -1) {
    throw new Error('Player not in match');
  }

  this.players.splice(index, 1);

  this.events.push({
    type: 'player-left',
    player: userId,
    timestamp: new Date()
  });

  // If host left and there are still players, assign new host
  if (this.host.toString() === userId.toString() && this.players.length > 0) {
    this.host = this.players[0].user;
  }

  // Cancel match if no players left
  if (this.players.length === 0) {
    this.status = 'cancelled';
  }
};

// Start match
matchSchema.methods.start = function() {
  if (this.status !== 'waiting') {
    throw new Error('Match already started or completed');
  }

  const allReady = this.players.every(p => p.isReady);
  if (!allReady) {
    throw new Error('Not all players are ready');
  }

  this.status = 'in-progress';
  this.startedAt = new Date();

  this.events.push({
    type: 'game-started',
    timestamp: new Date()
  });
};

// Complete match
matchSchema.methods.complete = function(results) {
  if (this.status !== 'in-progress' && this.status !== 'paused') {
    throw new Error('Match is not in progress');
  }

  this.status = 'completed';
  this.completedAt = new Date();
  this.duration = Math.floor((this.completedAt - this.startedAt) / 1000);

  // Sort results by score and assign ranks
  const sortedResults = results.sort((a, b) => b.score - a.score);
  this.results = sortedResults.map((result, index) => ({
    ...result,
    rank: index + 1
  }));

  // Set winner
  if (this.results.length > 0) {
    this.winner = this.results[0].user;
  }

  this.events.push({
    type: 'game-ended',
    timestamp: new Date()
  });
};

// Static method to find available matches
matchSchema.statics.findAvailableMatches = async function(gameId, matchType = 'casual') {
  return await this.find({
    game: gameId,
    status: 'waiting',
    matchType: matchType,
    'settings.isPrivate': false
  })
  .where('players')
  .exists()
  .populate('host', 'username avatar level')
  .populate('players.user', 'username avatar level')
  .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Match', matchSchema);
