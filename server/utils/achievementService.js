const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Score = require('../models/Score');
const Match = require('../models/Match');

class AchievementService {
  // Check and award achievements after a game/action
  static async checkAchievements(userId, context = {}) {
    const {
      gameId = null,
      score = null,
      matchId = null,
      action = null
    } = context;

    const user = await User.findById(userId).populate('achievements');
    const newAchievements = [];

    // Get all active achievements not yet unlocked by user
    const unlockedIds = user.achievements.map(a => a._id);
    const eligibleAchievements = await Achievement.find({
      isActive: true,
      _id: { $nin: unlockedIds }
    });

    for (const achievement of eligibleAchievements) {
      // Check if achievement is for specific game or global
      if (achievement.game && gameId && achievement.game.toString() !== gameId.toString()) {
        continue;
      }

      // Check level requirement
      if (achievement.requirements.minLevel > user.level) {
        continue;
      }

      // Check prerequisite achievements
      const hasPrerequisites = achievement.requirements.prerequisiteAchievements.every(
        prereq => unlockedIds.some(id => id.toString() === prereq.toString())
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

      // Check specific criteria
      const unlocked = await this.checkCriteria(achievement, user, context);

      if (unlocked) {
        // Award achievement
        user.achievements.push(achievement._id);
        user.addExperience(achievement.rewards.experience);

        achievement.stats.totalUnlocks += 1;
        await achievement.save();

        newAchievements.push(achievement);
      }
    }

    if (newAchievements.length > 0) {
      await user.save();
    }

    return newAchievements;
  }

  // Check specific achievement criteria
  static async checkCriteria(achievement, user, context) {
    const { type, target, comparison } = achievement.criteria;
    let value = 0;

    switch (type) {
      case 'score':
        value = context.score || 0;
        break;

      case 'wins':
        value = user.stats.gamesWon;
        break;

      case 'games-played':
        value = user.stats.gamesPlayed;
        break;

      case 'level':
        value = user.level;
        break;

      case 'accuracy':
        if (context.score) {
          const score = await Score.findById(context.score);
          value = score?.details?.accuracy || 0;
        }
        break;

      case 'streak':
        value = await this.calculateWinStreak(user._id);
        break;

      case 'time':
        if (context.score) {
          const score = await Score.findById(context.score);
          value = score?.details?.timeCompleted || 0;
        }
        break;

      case 'custom':
        // Custom criteria evaluation
        return await this.evaluateCustomCriteria(achievement, user, context);

      default:
        return false;
    }

    return this.compareValue(value, target, comparison);
  }

  // Compare value against target with specified comparison
  static compareValue(value, target, comparison) {
    switch (comparison) {
      case 'equals':
        return value === target;
      case 'greater-than':
        return value > target;
      case 'less-than':
        return value < target;
      case 'greater-or-equal':
        return value >= target;
      case 'less-or-equal':
        return value <= target;
      default:
        return false;
    }
  }

  // Calculate current win streak
  static async calculateWinStreak(userId) {
    const matches = await Match.find({
      'players.user': userId,
      status: 'completed'
    })
      .sort({ completedAt: -1 })
      .limit(50);

    let streak = 0;

    for (const match of matches) {
      if (match.winner && match.winner.toString() === userId.toString()) {
        streak++;
      } else {
        break; // Streak broken
      }
    }

    return streak;
  }

  // Evaluate custom criteria (placeholder for complex logic)
  static async evaluateCustomCriteria(achievement, user, context) {
    // This can be extended to handle custom achievement logic
    // For example: "Complete all games in physics category"
    // Or: "Play 5 different games in one day"

    if (achievement.criteria.customCondition) {
      // Parse and evaluate custom condition
      // This is a simplified example - you'd want more robust parsing
      const condition = achievement.criteria.customCondition;

      if (condition.includes('all-games-category')) {
        // Example: Complete all games in a specific category
        // Implementation would check if user has played all games in category
        return false; // Placeholder
      }
    }

    return false;
  }

  // Get achievement progress for a user
  static async getUserAchievementProgress(userId) {
    const user = await User.findById(userId).populate('achievements');
    const allAchievements = await Achievement.find({ isActive: true })
      .populate('game', 'name thumbnail');

    const progress = [];

    for (const achievement of allAchievements) {
      const unlocked = user.achievements.some(
        a => a._id.toString() === achievement._id.toString()
      );

      let currentProgress = 0;
      let progressPercentage = 0;

      if (!unlocked) {
        // Calculate partial progress
        const progressData = await this.calculateProgress(achievement, user);
        currentProgress = progressData.current;
        progressPercentage = Math.min(100, (currentProgress / achievement.criteria.target) * 100);
      } else {
        currentProgress = achievement.criteria.target;
        progressPercentage = 100;
      }

      progress.push({
        achievement: {
          _id: achievement._id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          type: achievement.type,
          rarity: achievement.rarity,
          isSecret: achievement.isSecret,
          game: achievement.game,
          rewards: achievement.rewards
        },
        unlocked,
        progress: {
          current: currentProgress,
          target: achievement.criteria.target,
          percentage: Math.round(progressPercentage)
        }
      });
    }

    // Group by category
    const grouped = {};
    for (const item of progress) {
      const category = item.achievement.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    }

    return {
      byCategory: grouped,
      all: progress,
      summary: {
        total: allAchievements.length,
        unlocked: user.achievements.length,
        percentage: Math.round((user.achievements.length / allAchievements.length) * 100)
      }
    };
  }

  // Calculate current progress towards an achievement
  static async calculateProgress(achievement, user) {
    const { type } = achievement.criteria;
    let current = 0;

    switch (type) {
      case 'score':
        // Get highest score for the game
        const highScore = await Score.findOne({
          user: user._id,
          ...(achievement.game && { game: achievement.game })
        }).sort({ score: -1 });
        current = highScore ? highScore.score : 0;
        break;

      case 'wins':
        current = user.stats.gamesWon;
        break;

      case 'games-played':
        current = user.stats.gamesPlayed;
        break;

      case 'level':
        current = user.level;
        break;

      case 'streak':
        current = await this.calculateWinStreak(user._id);
        break;

      default:
        current = 0;
    }

    return {
      current,
      target: achievement.criteria.target
    };
  }

  // Get recent unlocks for a user
  static async getRecentUnlocks(userId, limit = 10) {
    const user = await User.findById(userId).populate({
      path: 'achievements',
      options: { limit, sort: { createdAt: -1 } }
    });

    return user.achievements || [];
  }

  // Get rarest achievements
  static async getRarestAchievements(limit = 10) {
    const achievements = await Achievement.find({ isActive: true })
      .sort({ 'stats.totalUnlocks': 1 })
      .limit(limit)
      .populate('game', 'name thumbnail');

    const totalUsers = await User.countDocuments();

    return achievements.map(achievement => ({
      ...achievement.toObject(),
      unlockRate: totalUsers > 0
        ? ((achievement.stats.totalUnlocks / totalUsers) * 100).toFixed(2)
        : 0
    }));
  }

  // Create a set of default achievements for a game
  static async createDefaultAchievements(gameId) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');

    const defaultAchievements = [
      {
        name: `${game.name} Beginner`,
        description: `Play your first game of ${game.name}`,
        category: 'gameplay',
        type: 'bronze',
        game: gameId,
        criteria: {
          type: 'games-played',
          target: 1,
          comparison: 'greater-or-equal'
        },
        rewards: {
          experience: 50,
          badge: 'beginner'
        }
      },
      {
        name: `${game.name} Enthusiast`,
        description: `Play 10 games of ${game.name}`,
        category: 'gameplay',
        type: 'silver',
        game: gameId,
        criteria: {
          type: 'games-played',
          target: 10,
          comparison: 'greater-or-equal'
        },
        rewards: {
          experience: 100,
          badge: 'enthusiast'
        }
      },
      {
        name: `${game.name} High Scorer`,
        description: `Score 1000 points in ${game.name}`,
        category: 'mastery',
        type: 'gold',
        game: gameId,
        criteria: {
          type: 'score',
          target: 1000,
          comparison: 'greater-or-equal'
        },
        rewards: {
          experience: 200,
          badge: 'high-scorer'
        }
      },
      {
        name: `${game.name} Perfect`,
        description: `Achieve 100% accuracy in ${game.name}`,
        category: 'mastery',
        type: 'platinum',
        game: gameId,
        criteria: {
          type: 'accuracy',
          target: 100,
          comparison: 'equals'
        },
        rewards: {
          experience: 500,
          badge: 'perfect',
          title: 'Perfectionist'
        }
      }
    ];

    const created = await Achievement.insertMany(defaultAchievements);
    return created;
  }
}

module.exports = AchievementService;
