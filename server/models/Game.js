const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Game name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Game description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  thumbnail: {
    type: String,
    default: 'default-game-thumbnail.png'
  },
  category: {
    type: String,
    required: true,
    enum: ['physics', 'chemistry', 'biology', 'astronomy', 'mathematics', 'earth-science', 'general']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  gameType: {
    type: String,
    enum: ['single-player', 'multiplayer', 'both'],
    default: 'both'
  },
  maxPlayers: {
    type: Number,
    default: 4,
    min: 1,
    max: 10
  },
  minPlayers: {
    type: Number,
    default: 1,
    min: 1
  },
  gameplaySettings: {
    timeLimit: { type: Number, default: 300 }, // seconds
    scoreToWin: { type: Number, default: 1000 },
    roundsToWin: { type: Number, default: 3 },
    powerUpsEnabled: { type: Boolean, default: true }
  },
  educationalContent: {
    learningObjectives: [String],
    concepts: [String],
    ageRange: {
      min: { type: Number, default: 8 },
      max: { type: Number, default: 18 }
    }
  },
  stats: {
    totalPlays: { type: Number, default: 0 },
    uniquePlayers: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averagePlayTime: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 }
  },
  rewards: {
    baseExperience: { type: Number, default: 50 },
    winBonus: { type: Number, default: 100 },
    completionAchievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create slug from name before saving
gameSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
  }
  next();
});

// Update average score
gameSchema.methods.updateAverageScore = async function() {
  const Score = mongoose.model('Score');
  const result = await Score.aggregate([
    { $match: { game: this._id } },
    { $group: { _id: null, avgScore: { $avg: '$score' } } }
  ]);

  if (result.length > 0) {
    this.stats.averageScore = Math.round(result[0].avgScore);
  }
};

// Update rating
gameSchema.methods.updateRating = function(newRating) {
  const totalRatings = this.stats.totalRatings;
  const currentRating = this.stats.rating;

  this.stats.rating = ((currentRating * totalRatings) + newRating) / (totalRatings + 1);
  this.stats.totalRatings += 1;
};

module.exports = mongoose.model('Game', gameSchema);
