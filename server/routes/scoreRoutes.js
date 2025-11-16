const express = require('express');
const { body } = require('express-validator');
const {
  submitScore,
  getMyScores,
  getPersonalBests,
  getLeaderboard,
  getGlobalLeaderboard,
  getUserScoreStats,
  deleteScore
} = require('../controllers/scoreController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Validation rules
const submitScoreValidation = [
  body('gameId')
    .notEmpty()
    .withMessage('Game ID is required')
    .isMongoId()
    .withMessage('Invalid Game ID'),
  body('score')
    .isInt({ min: 0 })
    .withMessage('Score must be a positive number'),
  body('gameMode')
    .optional()
    .isIn(['single-player', 'multiplayer', 'practice', 'tournament'])
    .withMessage('Invalid game mode')
];

// Public routes
router.get('/leaderboard/:gameId', optionalAuth, getLeaderboard);
router.get('/global-leaderboard', getGlobalLeaderboard);
router.get('/stats/:userId', getUserScoreStats);

// Protected routes
router.use(protect);

router.post('/', submitScoreValidation, validate, submitScore);
router.get('/me', getMyScores);
router.get('/personal-bests', getPersonalBests);
router.delete('/:id', deleteScore);

module.exports = router;
