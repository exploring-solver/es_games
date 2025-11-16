const express = require('express');
const { protect } = require('../middleware/auth');
const MatchmakingService = require('../socket/matchmaking');

const router = express.Router();

// Initialize matchmaking service (will be set by server.js)
let matchmakingService;

const setMatchmakingService = (service) => {
  matchmakingService = service;
};

// @desc    Join matchmaking queue
// @route   POST /api/matchmaking/queue
// @access  Private
router.post('/queue', protect, async (req, res, next) => {
  try {
    const { gameId, preferences } = req.body;

    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: 'Game ID is required'
      });
    }

    const result = await matchmakingService.addToQueue(req.user.id, gameId, preferences);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Leave matchmaking queue
// @route   DELETE /api/matchmaking/queue
// @access  Private
router.delete('/queue', protect, async (req, res, next) => {
  try {
    const removed = matchmakingService.removeFromQueue(req.user.id);

    if (!removed) {
      return res.status(400).json({
        success: false,
        message: 'You are not in the matchmaking queue'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from matchmaking queue'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get queue status
// @route   GET /api/matchmaking/queue/status
// @access  Private
router.get('/queue/status', protect, async (req, res, next) => {
  try {
    const status = matchmakingService.getPlayerQueueStatus(req.user.id);

    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get queue status for a game
// @route   GET /api/matchmaking/queue/:gameId
// @access  Public
router.get('/queue/:gameId', async (req, res, next) => {
  try {
    const status = matchmakingService.getQueueStatus(req.params.gameId);

    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Quick match
// @route   POST /api/matchmaking/quick
// @access  Private
router.post('/quick', protect, async (req, res, next) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: 'Game ID is required'
      });
    }

    const result = await matchmakingService.quickMatch(req.user.id, gameId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Ranked matchmaking
// @route   POST /api/matchmaking/ranked
// @access  Private
router.post('/ranked', protect, async (req, res, next) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: 'Game ID is required'
      });
    }

    const result = await matchmakingService.rankedMatch(req.user.id, gameId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all active queues (admin)
// @route   GET /api/matchmaking/queues
// @access  Private/Admin
router.get('/queues', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const queues = matchmakingService.getAllQueues();

    res.status(200).json({
      success: true,
      data: queues
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { router, setMatchmakingService };
