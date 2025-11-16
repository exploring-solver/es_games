const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  rank: {
    type: Number,
    min: 1
  },
  details: {
    accuracy: { type: Number, min: 0, max: 100 },
    timeCompleted: { type: Number }, // seconds
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    powerUpsUsed: { type: Number, default: 0 },
    bonusPoints: { type: Number, default: 0 }
  },
  performance: {
    type: String,
    enum: ['poor', 'average', 'good', 'excellent', 'perfect'],
    default: 'average'
  },
  experienceGained: {
    type: Number,
    default: 0
  },
  achievementsUnlocked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  isPersonalBest: {
    type: Boolean,
    default: false
  },
  gameMode: {
    type: String,
    enum: ['single-player', 'multiplayer', 'practice', 'tournament'],
    default: 'single-player'
  },
  metadata: {
    deviceType: String,
    browser: String,
    screenResolution: String
  }
}, {
  timestamps: true
});

// Compound index for efficient leaderboard queries
scoreSchema.index({ game: 1, score: -1 });
scoreSchema.index({ user: 1, game: 1 });
scoreSchema.index({ createdAt: -1 });

// Calculate performance based on score
scoreSchema.pre('save', function(next) {
  if (this.details.accuracy) {
    if (this.details.accuracy >= 95) {
      this.performance = 'perfect';
    } else if (this.details.accuracy >= 80) {
      this.performance = 'excellent';
    } else if (this.details.accuracy >= 65) {
      this.performance = 'good';
    } else if (this.details.accuracy >= 50) {
      this.performance = 'average';
    } else {
      this.performance = 'poor';
    }
  }
  next();
});

// Static method to get leaderboard
scoreSchema.statics.getLeaderboard = async function(gameId, limit = 10, timeFrame = 'all-time') {
  const query = { game: gameId };

  // Add time frame filter
  if (timeFrame === 'daily') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query.createdAt = { $gte: today };
  } else if (timeFrame === 'weekly') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    query.createdAt = { $gte: weekAgo };
  } else if (timeFrame === 'monthly') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    query.createdAt = { $gte: monthAgo };
  }

  return await this.aggregate([
    { $match: query },
    { $sort: { score: -1 } },
    {
      $group: {
        _id: '$user',
        highestScore: { $first: '$score' },
        scoreId: { $first: '$_id' },
        createdAt: { $first: '$createdAt' }
      }
    },
    { $sort: { highestScore: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: '$scoreId',
        userId: '$_id',
        username: '$user.username',
        avatar: '$user.avatar',
        level: '$user.level',
        score: '$highestScore',
        createdAt: 1
      }
    }
  ]);
};

// Static method to check if score is personal best
scoreSchema.statics.checkPersonalBest = async function(userId, gameId, newScore) {
  const highestScore = await this.findOne({
    user: userId,
    game: gameId
  }).sort({ score: -1 });

  return !highestScore || newScore > highestScore.score;
};

module.exports = mongoose.model('Score', scoreSchema);
