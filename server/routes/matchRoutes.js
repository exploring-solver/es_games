const express = require('express');
const { body } = require('express-validator');
const {
  createMatch,
  getMatches,
  getAvailableMatches,
  getMatch,
  getMatchByRoomId,
  joinMatch,
  leaveMatch,
  toggleReady,
  startMatch,
  completeMatch,
  getUserMatches,
  cancelMatch
} = require('../controllers/matchController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Validation rules
const createMatchValidation = [
  body('gameId')
    .notEmpty()
    .withMessage('Game ID is required')
    .isMongoId()
    .withMessage('Invalid Game ID'),
  body('settings.matchType')
    .optional()
    .isIn(['casual', 'ranked', 'tournament', 'private'])
    .withMessage('Invalid match type')
];

const completeMatchValidation = [
  body('results')
    .isArray({ min: 1 })
    .withMessage('Results must be an array with at least one entry'),
  body('results.*.user')
    .isMongoId()
    .withMessage('Invalid user ID in results'),
  body('results.*.score')
    .isInt({ min: 0 })
    .withMessage('Score must be a positive number')
];

// Public routes
router.get('/', getMatches);
router.get('/available/:gameId', getAvailableMatches);
router.get('/room/:roomId', getMatchByRoomId);
router.get('/user/:userId', getUserMatches);
router.get('/:id', getMatch);

// Protected routes
router.use(protect);

router.post('/', createMatchValidation, validate, createMatch);
router.post('/:id/join', joinMatch);
router.post('/:id/leave', leaveMatch);
router.put('/:id/ready', toggleReady);
router.post('/:id/start', startMatch);
router.post('/:id/complete', completeMatchValidation, validate, completeMatch);
router.delete('/:id', cancelMatch);

module.exports = router;
