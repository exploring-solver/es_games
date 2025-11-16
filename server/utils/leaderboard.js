const Score = require('../models/Score');
const User = require('../models/User');
const Game = require('../models/Game');

class LeaderboardService {
  // Get game-specific leaderboard with various filters
  static async getGameLeaderboard(gameId, options = {}) {
    const {
      timeFrame = 'all-time', // 'daily', 'weekly', 'monthly', 'all-time'
      limit = 100,
      offset = 0,
      includeStats = false
    } = options;

    const query = { game: gameId };

    // Add time frame filter
    const timeFilter = this.getTimeFilter(timeFrame);
    if (timeFilter) {
      query.createdAt = timeFilter;
    }

    const pipeline = [
      { $match: query },
      { $sort: { score: -1 } },
      // Group by user to get highest score
      {
        $group: {
          _id: '$user',
          highestScore: { $first: '$score' },
          scoreId: { $first: '$_id' },
          details: { $first: '$details' },
          createdAt: { $first: '$createdAt' },
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { highestScore: -1 } },
      { $skip: offset },
      { $limit: limit },
      // Join with users collection
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      // Project final shape
      {
        $project: {
          _id: '$scoreId',
          userId: '$_id',
          username: '$user.username',
          avatar: '$user.avatar',
          level: '$user.level',
          score: '$highestScore',
          details: 1,
          createdAt: 1,
          ...(includeStats && {
            stats: {
              gamesPlayed: '$gamesPlayed',
              averageScore: { $round: ['$averageScore', 0] }
            }
          })
        }
      }
    ];

    const results = await Score.aggregate(pipeline);

    // Add rank to each entry
    return results.map((entry, index) => ({
      rank: offset + index + 1,
      ...entry
    }));
  }

  // Get global leaderboard across all games
  static async getGlobalLeaderboard(options = {}) {
    const {
      limit = 100,
      offset = 0,
      sortBy = 'totalScore' // 'totalScore', 'level', 'winRate', 'gamesWon'
    } = options;

    const sortField = `stats.${sortBy}`;
    const sortOrder = {};
    sortOrder[sortField] = -1;

    const users = await User.find()
      .select('username avatar level stats')
      .sort(sortOrder)
      .skip(offset)
      .limit(limit);

    return users.map((user, index) => ({
      rank: offset + index + 1,
      userId: user._id,
      username: user.username,
      avatar: user.avatar,
      level: user.level,
      totalScore: user.stats.totalScore,
      gamesPlayed: user.stats.gamesPlayed,
      gamesWon: user.stats.gamesWon,
      winRate: user.stats.winRate,
      highestScore: user.stats.highestScore
    }));
  }

  // Get category-specific leaderboard
  static async getCategoryLeaderboard(category, options = {}) {
    const {
      timeFrame = 'all-time',
      limit = 100,
      offset = 0
    } = options;

    // First, get all games in this category
    const games = await Game.find({ category, isActive: true }).select('_id');
    const gameIds = games.map(g => g._id);

    const query = { game: { $in: gameIds } };

    // Add time frame filter
    const timeFilter = this.getTimeFilter(timeFrame);
    if (timeFilter) {
      query.createdAt = timeFilter;
    }

    const pipeline = [
      { $match: query },
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          highestScore: { $max: '$score' },
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { totalScore: -1 } },
      { $skip: offset },
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
          userId: '$_id',
          username: '$user.username',
          avatar: '$user.avatar',
          level: '$user.level',
          totalScore: 1,
          highestScore: 1,
          gamesPlayed: 1,
          averageScore: { $round: ['$averageScore', 0] }
        }
      }
    ];

    const results = await Score.aggregate(pipeline);

    return results.map((entry, index) => ({
      rank: offset + index + 1,
      ...entry
    }));
  }

  // Get friends leaderboard
  static async getFriendsLeaderboard(userId, gameId = null, options = {}) {
    const { limit = 50 } = options;

    const user = await User.findById(userId).populate('friends', 'username avatar level stats');

    if (!user || !user.friends.length) {
      return [];
    }

    const friendIds = [userId, ...user.friends.map(f => f._id)];

    let leaderboard;

    if (gameId) {
      // Game-specific friends leaderboard
      const pipeline = [
        { $match: { user: { $in: friendIds }, game: gameId } },
        { $sort: { score: -1 } },
        {
          $group: {
            _id: '$user',
            highestScore: { $first: '$score' },
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
            userId: '$_id',
            username: '$user.username',
            avatar: '$user.avatar',
            level: '$user.level',
            score: '$highestScore',
            createdAt: 1
          }
        }
      ];

      leaderboard = await Score.aggregate(pipeline);
    } else {
      // Global friends leaderboard
      const friends = await User.find({ _id: { $in: friendIds } })
        .select('username avatar level stats')
        .sort({ 'stats.totalScore': -1 })
        .limit(limit);

      leaderboard = friends.map(friend => ({
        userId: friend._id,
        username: friend.username,
        avatar: friend.avatar,
        level: friend.level,
        totalScore: friend.stats.totalScore,
        gamesPlayed: friend.stats.gamesPlayed
      }));
    }

    return leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
      isCurrentUser: entry.userId.toString() === userId.toString()
    }));
  }

  // Get user's rank in a specific leaderboard
  static async getUserRank(userId, gameId = null, timeFrame = 'all-time') {
    if (gameId) {
      // Game-specific rank
      const query = { game: gameId };

      const timeFilter = this.getTimeFilter(timeFrame);
      if (timeFilter) {
        query.createdAt = timeFilter;
      }

      const pipeline = [
        { $match: query },
        { $sort: { score: -1 } },
        {
          $group: {
            _id: '$user',
            highestScore: { $first: '$score' }
          }
        },
        { $sort: { highestScore: -1 } }
      ];

      const results = await Score.aggregate(pipeline);
      const rank = results.findIndex(r => r._id.toString() === userId.toString()) + 1;

      return {
        rank: rank > 0 ? rank : null,
        totalPlayers: results.length,
        score: rank > 0 ? results[rank - 1].highestScore : 0
      };
    } else {
      // Global rank
      const user = await User.findById(userId);
      if (!user) return null;

      const higherRankedCount = await User.countDocuments({
        'stats.totalScore': { $gt: user.stats.totalScore }
      });

      const totalUsers = await User.countDocuments();

      return {
        rank: higherRankedCount + 1,
        totalPlayers: totalUsers,
        score: user.stats.totalScore
      };
    }
  }

  // Get trending players (based on recent performance)
  static async getTrendingPlayers(options = {}) {
    const { limit = 20, days = 7 } = options;

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const pipeline = [
      { $match: { createdAt: { $gte: dateFrom } } },
      {
        $group: {
          _id: '$user',
          recentScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      {
        $match: {
          gamesPlayed: { $gte: 3 } // At least 3 games played
        }
      },
      { $sort: { recentScore: -1 } },
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
          userId: '$_id',
          username: '$user.username',
          avatar: '$user.avatar',
          level: '$user.level',
          recentScore: 1,
          gamesPlayed: 1,
          averageScore: { $round: ['$averageScore', 0] }
        }
      }
    ];

    const results = await Score.aggregate(pipeline);

    return results.map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));
  }

  // Helper: Get time filter based on timeframe
  static getTimeFilter(timeFrame) {
    const now = new Date();

    switch (timeFrame) {
      case 'daily':
        const today = new Date(now.setHours(0, 0, 0, 0));
        return { $gte: today };

      case 'weekly':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { $gte: weekAgo };

      case 'monthly':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { $gte: monthAgo };

      case 'yearly':
        const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return { $gte: yearAgo };

      case 'all-time':
      default:
        return null;
    }
  }

  // Get leaderboard statistics
  static async getLeaderboardStats(gameId = null) {
    if (gameId) {
      const stats = await Score.aggregate([
        { $match: { game: gameId } },
        {
          $group: {
            _id: null,
            totalScores: { $sum: 1 },
            highestScore: { $max: '$score' },
            averageScore: { $avg: '$score' },
            uniquePlayers: { $addToSet: '$user' }
          }
        },
        {
          $project: {
            _id: 0,
            totalScores: 1,
            highestScore: 1,
            averageScore: { $round: ['$averageScore', 0] },
            uniquePlayers: { $size: '$uniquePlayers' }
          }
        }
      ]);

      return stats[0] || {};
    } else {
      const totalUsers = await User.countDocuments();
      const totalScores = await Score.countDocuments();

      const topPlayer = await User.findOne()
        .sort({ 'stats.totalScore': -1 })
        .select('username stats.totalScore');

      return {
        totalUsers,
        totalScores,
        topPlayer: topPlayer ? {
          username: topPlayer.username,
          totalScore: topPlayer.stats.totalScore
        } : null
      };
    }
  }
}

module.exports = LeaderboardService;
