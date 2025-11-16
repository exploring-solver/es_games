const express = require('express');
const Achievement = require('../models/Achievement');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { category, type, gameId } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (type) query.type = type;
    if (gameId) query.game = gameId;

    const achievements = await Achievement.find(query)
      .populate('game', 'name thumbnail')
      .sort({ order: 1, category: 1 });

    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's achievement progress
// @route   GET /api/achievements/progress
// @access  Private
router.get('/progress', protect, async (req, res, next) => {
  try {
    const progress = await Achievement.getUserProgress(req.user.id);

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate('game', 'name thumbnail');

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create achievement
// @route   POST /api/achievements
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const achievement = await Achievement.create(req.body);

    res.status(201).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    await achievement.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
