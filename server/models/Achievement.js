const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
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
    required: [true, 'Achievement description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    default: 'default-achievement.png'
  },
  category: {
    type: String,
    enum: ['gameplay', 'social', 'mastery', 'exploration', 'special', 'seasonal'],
    default: 'gameplay'
  },
  type: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    default: null // null means global achievement
  },
  criteria: {
    type: {
      type: String,
      enum: ['score', 'wins', 'games-played', 'streak', 'level', 'time', 'accuracy', 'custom'],
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    comparison: {
      type: String,
      enum: ['equals', 'greater-than', 'less-than', 'greater-or-equal', 'less-or-equal'],
      default: 'greater-or-equal'
    },
    customCondition: String
  },
  rewards: {
    experience: {
      type: Number,
      default: 100
    },
    badge: {
      type: String
    },
    title: {
      type: String
    },
    customRewards: mongoose.Schema.Types.Mixed
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  stats: {
    totalUnlocks: {
      type: Number,
      default: 0
    },
    unlockRate: {
      type: Number,
      default: 0 // percentage of users who unlocked it
    }
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unlockMessage: {
    type: String,
    default: 'Achievement Unlocked!'
  },
  order: {
    type: Number,
    default: 0
  },
  requirements: {
    minLevel: {
      type: Number,
      default: 0
    },
    prerequisiteAchievements: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    }]
  },
  timeframe: {
    startDate: Date,
    endDate: Date
  }
}, {
  timestamps: true
});

// Create slug from name before saving
achievementSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
  }
  next();
});

// Index for efficient queries
achievementSchema.index({ slug: 1 });
achievementSchema.index({ category: 1, type: 1 });
achievementSchema.index({ game: 1 });

// Check if user meets achievement criteria
achievementSchema.methods.checkCriteria = function(userValue) {
  const { comparison, target } = this.criteria;

  switch (comparison) {
    case 'equals':
      return userValue === target;
    case 'greater-than':
      return userValue > target;
    case 'less-than':
      return userValue < target;
    case 'greater-or-equal':
      return userValue >= target;
    case 'less-or-equal':
      return userValue <= target;
    default:
      return false;
  }
};

// Static method to get user achievements progress
achievementSchema.statics.getUserProgress = async function(userId) {
  const User = mongoose.model('User');
  const user = await User.findById(userId).populate('achievements');

  const allAchievements = await this.find({ isActive: true });

  return allAchievements.map(achievement => {
    const unlocked = user.achievements.some(a => a._id.toString() === achievement._id.toString());
    return {
      achievement,
      unlocked,
      progress: unlocked ? 100 : 0 // Can be enhanced to show partial progress
    };
  });
};

// Static method to check and award achievements
achievementSchema.statics.checkAndAward = async function(userId, criteriaType, value, gameId = null) {
  const User = mongoose.model('User');
  const user = await User.findById(userId).populate('achievements');

  const query = {
    'criteria.type': criteriaType,
    isActive: true,
    _id: { $nin: user.achievements }
  };

  if (gameId) {
    query.$or = [{ game: gameId }, { game: null }];
  } else {
    query.game = null;
  }

  const eligibleAchievements = await this.find(query);
  const newlyUnlocked = [];

  for (const achievement of eligibleAchievements) {
    // Check level requirement
    if (achievement.requirements.minLevel > user.level) {
      continue;
    }

    // Check prerequisite achievements
    const hasPrerequisites = achievement.requirements.prerequisiteAchievements.every(
      prereq => user.achievements.some(a => a._id.toString() === prereq.toString())
    );

    if (!hasPrerequisites) {
      continue;
    }

    // Check timeframe
    if (achievement.timeframe.startDate && new Date() < achievement.timeframe.startDate) {
      continue;
    }
    if (achievement.timeframe.endDate && new Date() > achievement.timeframe.endDate) {
      continue;
    }

    // Check criteria
    if (achievement.checkCriteria(value)) {
      user.achievements.push(achievement._id);
      user.addExperience(achievement.rewards.experience);
      achievement.stats.totalUnlocks += 1;

      await achievement.save();
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length > 0) {
    await user.save();
  }

  return newlyUnlocked;
};

module.exports = mongoose.model('Achievement', achievementSchema);
