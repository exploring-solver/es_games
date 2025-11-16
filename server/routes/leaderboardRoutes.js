const express = require('express');
const LeaderboardService = require('../utils/leaderboard');
const { optionalAuth, protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get game leaderboard
// @route   GET /api/leaderboard/game/:gameId
// @access  Public
router.get('/game/:gameId', optionalAuth, async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const {
      timeFrame = 'all-time',
      limit = 100,
      offset = 0,
      includeStats = false
    } = req.query;

    const leaderboard = await LeaderboardService.getGameLeaderboard(gameId, {
      timeFrame,
      limit: parseInt(limit),
      offset: parseInt(offset),
      includeStats: includeStats === 'true'
    });

    // Get user's rank if authenticated
    let userRank = null;
    if (req.user) {
      userRank = await LeaderboardService.getUserRank(req.user.id, gameId, timeFrame);
    }

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
      userRank
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get global leaderboard
// @route   GET /api/leaderboard/global
// @access  Public
router.get('/global', async (req, res, next) => {
  try {
    const {
      limit = 100,
      offset = 0,
      sortBy = 'totalScore'
    } = req.query;

    const leaderboard = await LeaderboardService.getGlobalLeaderboard({
      limit: parseInt(limit),
      offset: parseInt(offset),
      sortBy
    });

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get category leaderboard
// @route   GET /api/leaderboard/category/:category
// @access  Public
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const {
      timeFrame = 'all-time',
      limit = 100,
      offset = 0
    } = req.query;

    const leaderboard = await LeaderboardService.getCategoryLeaderboard(category, {
      timeFrame,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get friends leaderboard
// @route   GET /api/leaderboard/friends
// @access  Private
router.get('/friends', protect, async (req, res, next) => {
  try {
    const { gameId, limit = 50 } = req.query;

    const leaderboard = await LeaderboardService.getFriendsLeaderboard(
      req.user.id,
      gameId || null,
      { limit: parseInt(limit) }
    );

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user rank
// @route   GET /api/leaderboard/rank
// @access  Private
router.get('/rank', protect, async (req, res, next) => {
  try {
    const { gameId, timeFrame = 'all-time' } = req.query;

    const rank = await LeaderboardService.getUserRank(
      req.user.id,
      gameId || null,
      timeFrame
    );

    res.status(200).json({
      success: true,
      data: rank
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get trending players
// @route   GET /api/leaderboard/trending
// @access  Public
router.get('/trending', async (req, res, next) => {
  try {
    const { limit = 20, days = 7 } = req.query;

    const trending = await LeaderboardService.getTrendingPlayers({
      limit: parseInt(limit),
      days: parseInt(days)
    });

    res.status(200).json({
      success: true,
      count: trending.length,
      data: trending
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get leaderboard stats
// @route   GET /api/leaderboard/stats
// @access  Public
router.get('/stats', async (req, res, next) => {
  try {
    const { gameId } = req.query;

    const stats = await LeaderboardService.getLeaderboardStats(gameId || null);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
