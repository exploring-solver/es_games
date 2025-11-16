const express = require('express');
const { body } = require('express-validator');
const {
  getGames,
  getGame,
  getGameBySlug,
  createGame,
  updateGame,
  deleteGame,
  getGameStats,
  rateGame,
  incrementPlayCount,
  getPopularGames,
  getRecommendedGames
} = require('../controllers/gameController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Validation rules
const createGameValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Game name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Game description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .isIn(['physics', 'chemistry', 'biology', 'astronomy', 'mathematics', 'earth-science', 'general'])
    .withMessage('Invalid category')
];

const rateGameValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

// Public routes
router.get('/', getGames);
router.get('/popular', getPopularGames);
router.get('/slug/:slug', getGameBySlug);
router.get('/:id', getGame);
router.get('/:id/stats', getGameStats);
router.post('/:id/play', incrementPlayCount);

// Protected routes
router.post('/:id/rate', protect, rateGameValidation, validate, rateGame);
router.get('/recommended', protect, getRecommendedGames);

// Admin routes
router.post('/', protect, authorize('admin'), createGameValidation, validate, createGame);
router.put('/:id', protect, authorize('admin'), updateGame);
router.delete('/:id', protect, authorize('admin'), deleteGame);

module.exports = router;
