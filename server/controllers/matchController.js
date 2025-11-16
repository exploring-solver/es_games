const Match = require('../models/Match');
const Game = require('../models/Game');
const User = require('../models/User');
const Score = require('../models/Score');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Create a new match
// @route   POST /api/matches
// @access  Private
exports.createMatch = async (req, res, next) => {
  try {
    const { gameId, settings } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return next(new ErrorResponse('Game not found', 404));
    }

    const roomId = Match.generateRoomId();

    const match = await Match.create({
      game: gameId,
      roomId,
      host: req.user.id,
      settings: {
        ...settings,
        maxPlayers: settings?.maxPlayers || game.maxPlayers
      },
      players: [{
        user: req.user.id,
        username: req.user.username,
        avatar: req.user.avatar
      }]
    });

    await match.populate('game', 'name thumbnail maxPlayers');

    res.status(201).json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available matches
// @route   GET /api/matches
// @access  Public
exports.getMatches = async (req, res, next) => {
  try {
    const { gameId, status, matchType } = req.query;

    const query = {};
    if (gameId) query.game = gameId;
    if (status) query.status = status;
    if (matchType) query.matchType = matchType;

    const matches = await Match.find(query)
      .populate('game', 'name thumbnail')
      .populate('host', 'username avatar level')
      .populate('players.user', 'username avatar level')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available matches for a game
// @route   GET /api/matches/available/:gameId
// @access  Public
exports.getAvailableMatches = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const { matchType = 'casual' } = req.query;

    const matches = await Match.findAvailableMatches(gameId, matchType);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single match
// @route   GET /api/matches/:id
// @access  Public
exports.getMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('game')
      .populate('host', 'username avatar level')
      .populate('players.user', 'username avatar level')
      .populate('winner', 'username avatar level');

    if (!match) {
      return next(new ErrorResponse('Match not found', 404));
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get match by room ID
// @route   GET /api/matches/room/:roomId
// @access  Public
exports.getMatchByRoomId = async (req, res, next) => {
  try {
    const match = await Match.findOne({ roomId: req.params.roomId })
      .populate('game')
      .populate('host', 'username avatar level')
      .populate('players.user', 'username avatar level');

    if (!match) {
      return next(new ErrorResponse('Match not found', 404));
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a match
// @route   POST /api/matches/:id/join
// @access  Private
exports.joinMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return next(new ErrorResponse('Match not found', 404));
    }

    if (match.status !== 'waiting') {
      return next(new ErrorResponse('Match has already started or is completed', 400));
    }

    match.addPlayer(req.user);
    await match.save();

    await match.populate('players.user', 'username avatar level');

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    if (error.message === 'Match is full' || error.message === 'Player already in match') {
      return next(new ErrorResponse(error.message, 400));
    }
    next(error);
  }
};

// @desc    Leave a match
// @route   POST /api/matches/:id/leave
// @access  Private
exports.leaveMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return next(new ErrorResponse('Match not found', 404));
    }

    match.removePlayer(req.user.id);
    await match.save();

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    if (error.message === 'Player not in match') {
      return next(new ErrorResponse(error.message, 400));
    }
    next(error);
  }
};

// @desc    Update player ready status
// @route   PUT /api/matches/:id/ready
// @access  Private
exports.toggleReady = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return next(new ErrorResponse('Match not found', 404));
    }

    const player = match.players.find(p => p.user.toString() === req.user.id);
    if (!player) {
      return next(new ErrorResponse('You are not in this match', 400));
    }

    player.isReady = !player.isReady;
    await match.save();

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start a match
// @route   POST /api/matches/:id/start
// @access  Private
exports.startMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return next(new ErrorResponse('Match not found', 404));
    }

    if (match.host.toString() !== req.user.id) {
      return next(new ErrorResponse('Only the host can start the match', 403));
    }

    match.start();
    await match.save();

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    if (error.message.includes('already started') || error.message.includes('Not all players')) {
      return next(new ErrorResponse(error.message, 400));
    }
    next(error);
  }
};

// @desc    Complete a match
// @route   POST /api/matches/:id/complete
// @access  Private
exports.completeMatch = async (req, res, next) => {
  try {
    const { results } = req.body;

    const match = await Match.findById(req.params.id);

    if (!match) {
      return next(new ErrorResponse('Match not found', 404));
    }

    if (match.host.toString() !== req.user.id) {
      return next(new ErrorResponse('Only the host can complete the match', 403));
    }

    match.complete(results);
    await match.save();

    // Create score records for all players
    const scorePromises = results.map(result =>
      Score.create({
        user: result.user,
        game: match.game,
        match: match._id,
        score: result.score,
        rank: result.rank,
        details: result.stats,
        gameMode: 'multiplayer'
      })
    );

    await Promise.all(scorePromises);

    // Update user stats
    for (const result of results) {
      const user = await User.findById(result.user);
      if (user) {
        user.stats.gamesPlayed += 1;
        user.stats.totalScore += result.score;

        if (result.rank === 1) {
          user.stats.gamesWon += 1;
        }

        user.updateWinRate();
        await user.save();
      }
    }

    await match.populate('winner', 'username avatar level');

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    if (error.message.includes('not in progress')) {
      return next(new ErrorResponse(error.message, 400));
    }
    next(error);
  }
};

// @desc    Get user's match history
// @route   GET /api/matches/user/:userId
// @access  Public
exports.getUserMatches = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;

    const matches = await Match.find({
      'players.user': userId,
      status: 'completed'
    })
      .populate('game', 'name thumbnail')
      .populate('winner', 'username avatar')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Match.countDocuments({
      'players.user': userId,
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      count: matches.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a match
// @route   DELETE /api/matches/:id
// @access  Private
exports.cancelMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return next(new ErrorResponse('Match not found', 404));
    }

    if (match.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Only the host or admin can cancel the match', 403));
    }

    if (match.status === 'completed') {
      return next(new ErrorResponse('Cannot cancel a completed match', 400));
    }

    match.status = 'cancelled';
    await match.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
