const Score = require('../models/Score');
const Game = require('../models/Game');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Submit a score
// @route   POST /api/scores
// @access  Private
exports.submitScore = async (req, res, next) => {
  try {
    const { gameId, score, details, gameMode, metadata } = req.body;

    // Validate game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return next(new ErrorResponse('Game not found', 404));
    }

    // Check if it's a personal best
    const isPersonalBest = await Score.checkPersonalBest(req.user.id, gameId, score);

    // Create score record
    const scoreRecord = await Score.create({
      user: req.user.id,
      game: gameId,
      score,
      details,
      gameMode,
      metadata,
      isPersonalBest
    });

    // Update user stats
    const user = await User.findById(req.user.id);
    user.stats.gamesPlayed += 1;
    user.stats.totalScore += score;

    if (score > user.stats.highestScore) {
      user.stats.highestScore = score;
    }

    // Add experience based on performance
    let experienceGained = game.rewards.baseExperience;
    if (details && details.accuracy >= 90) {
      experienceGained += 50;
    }
    const leveledUp = user.addExperience(experienceGained);

    await user.save();

    // Check for achievements
    const newAchievements = await Achievement.checkAndAward(
      req.user.id,
      'score',
      score,
      gameId
    );

    // Update game stats
    game.stats.totalPlays += 1;
    await game.updateAverageScore();
    await game.save();

    res.status(201).json({
      success: true,
      data: scoreRecord,
      isPersonalBest,
      leveledUp,
      experienceGained,
      newAchievements: newAchievements.length > 0 ? newAchievements : undefined
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's scores
// @route   GET /api/scores/me
// @access  Private
exports.getMyScores = async (req, res, next) => {
  try {
    const { gameId, limit = 20, page = 1 } = req.query;

    const query = { user: req.user.id };
    if (gameId) query.game = gameId;

    const scores = await Score.find(query)
      .populate('game', 'name thumbnail category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Score.countDocuments(query);

    res.status(200).json({
      success: true,
      count: scores.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: scores
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's personal bests
// @route   GET /api/scores/personal-bests
// @access  Private
exports.getPersonalBests = async (req, res, next) => {
  try {
    const personalBests = await Score.aggregate([
      { $match: { user: req.user._id } },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$game',
          highestScore: { $first: '$score' },
          scoreId: { $first: '$_id' },
          details: { $first: '$details' },
          createdAt: { $first: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'games',
          localField: '_id',
          foreignField: '_id',
          as: 'game'
        }
      },
      { $unwind: '$game' },
      {
        $project: {
          _id: '$scoreId',
          game: {
            _id: '$game._id',
            name: '$game.name',
            thumbnail: '$game.thumbnail',
            category: '$game.category'
          },
          score: '$highestScore',
          details: 1,
          createdAt: 1
        }
      },
      { $sort: { score: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: personalBests.length,
      data: personalBests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard for a game
// @route   GET /api/scores/leaderboard/:gameId
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const { timeFrame = 'all-time', limit = 100 } = req.query;

    const game = await Game.findById(gameId);
    if (!game) {
      return next(new ErrorResponse('Game not found', 404));
    }

    const leaderboard = await Score.getLeaderboard(gameId, parseInt(limit), timeFrame);

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));

    // If user is authenticated, find their rank
    let userRank = null;
    if (req.user) {
      const userIndex = rankedLeaderboard.findIndex(
        entry => entry.userId.toString() === req.user.id
      );
      if (userIndex !== -1) {
        userRank = {
          rank: userIndex + 1,
          ...rankedLeaderboard[userIndex]
        };
      }
    }

    res.status(200).json({
      success: true,
      count: rankedLeaderboard.length,
      data: rankedLeaderboard,
      userRank
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get global leaderboard
// @route   GET /api/scores/global-leaderboard
// @access  Public
exports.getGlobalLeaderboard = async (req, res, next) => {
  try {
    const { limit = 100 } = req.query;

    const leaderboard = await User.find()
      .select('username avatar level stats')
      .sort({ 'stats.totalScore': -1, level: -1 })
      .limit(parseInt(limit));

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      avatar: user.avatar,
      level: user.level,
      totalScore: user.stats.totalScore,
      gamesPlayed: user.stats.gamesPlayed,
      winRate: user.stats.winRate
    }));

    res.status(200).json({
      success: true,
      count: rankedLeaderboard.length,
      data: rankedLeaderboard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get score statistics for a user
// @route   GET /api/scores/stats/:userId
// @access  Public
exports.getUserScoreStats = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const stats = await Score.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalScores: { $sum: 1 },
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          totalPoints: { $sum: '$score' }
        }
      }
    ]);

    const categoryStats = await Score.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'games',
          localField: 'game',
          foreignField: '_id',
          as: 'gameInfo'
        }
      },
      { $unwind: '$gameInfo' },
      {
        $group: {
          _id: '$gameInfo.category',
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || {},
        byCategory: categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete score
// @route   DELETE /api/scores/:id
// @access  Private
exports.deleteScore = async (req, res, next) => {
  try {
    const score = await Score.findById(req.params.id);

    if (!score) {
      return next(new ErrorResponse('Score not found', 404));
    }

    // Make sure user is score owner or admin
    if (score.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this score', 403));
    }

    await score.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
