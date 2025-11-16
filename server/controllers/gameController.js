const Game = require('../models/Game');
const Score = require('../models/Score');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Get all games
// @route   GET /api/games
// @access  Public
exports.getGames = async (req, res, next) => {
  try {
    const { category, difficulty, gameType, isActive } = req.query;

    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (gameType) query.gameType = { $in: [gameType, 'both'] };
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const games = await Game.find(query).sort({ 'stats.totalPlays': -1 });

    res.status(200).json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single game
// @route   GET /api/games/:id
// @access  Public
exports.getGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return next(new ErrorResponse('Game not found', 404));
    }

    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get game by slug
// @route   GET /api/games/slug/:slug
// @access  Public
exports.getGameBySlug = async (req, res, next) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });

    if (!game) {
      return next(new ErrorResponse('Game not found', 404));
    }

    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new game
// @route   POST /api/games
// @access  Private/Admin
exports.createGame = async (req, res, next) => {
  try {
    const game = await Game.create(req.body);

    res.status(201).json({
      success: true,
      data: game
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update game
// @route   PUT /api/games/:id
// @access  Private/Admin
exports.updateGame = async (req, res, next) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!game) {
      return next(new ErrorResponse('Game not found', 404));
    }

    game.lastUpdated = new Date();
    await game.save();

    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete game
// @route   DELETE /api/games/:id
// @access  Private/Admin
exports.deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return next(new ErrorResponse('Game not found', 404));
    }

    await game.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get game statistics
// @route   GET /api/games/:id/stats
// @access  Public
exports.getGameStats = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return next(new ErrorResponse('Game not found', 404));
    }

    // Get additional stats from scores
    const scoreStats = await Score.aggregate([
      { $match: { game: game._id } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          totalScores: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      ...game.stats.toObject(),
      ...(scoreStats.length > 0 && {
        averageScore: Math.round(scoreStats[0].averageScore),
        highestScore: scoreStats[0].highestScore,
        totalScores: scoreStats[0].totalScores
      })
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate game
// @route   POST /api/games/:id/rate
// @access  Private
exports.rateGame = async (req, res, next) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return next(new ErrorResponse('Rating must be between 1 and 5', 400));
    }

    const game = await Game.findById(req.params.id);

    if (!game) {
      return next(new ErrorResponse('Game not found', 404));
    }

    game.updateRating(rating);
    await game.save();

    res.status(200).json({
      success: true,
      data: {
        rating: game.stats.rating,
        totalRatings: game.stats.totalRatings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment game play count
// @route   POST /api/games/:id/play
// @access  Public
exports.incrementPlayCount = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return next(new ErrorResponse('Game not found', 404));
    }

    game.stats.totalPlays += 1;
    await game.save();

    res.status(200).json({
      success: true,
      data: {
        totalPlays: game.stats.totalPlays
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular games
// @route   GET /api/games/popular
// @access  Public
exports.getPopularGames = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const games = await Game.find({ isActive: true })
      .sort({ 'stats.totalPlays': -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended games for user
// @route   GET /api/games/recommended
// @access  Private
exports.getRecommendedGames = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's most played game categories
    const userScores = await Score.find({ user: userId })
      .populate('game', 'category')
      .limit(50);

    const categoryCount = {};
    userScores.forEach(score => {
      const category = score.game?.category;
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });

    // Get top categories
    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    // Get games from these categories that user hasn't played much
    const playedGameIds = userScores.map(score => score.game._id);

    const recommendedGames = await Game.find({
      isActive: true,
      category: { $in: topCategories },
      _id: { $nin: playedGameIds }
    })
      .sort({ 'stats.rating': -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: recommendedGames.length,
      data: recommendedGames
    });
  } catch (error) {
    next(error);
  }
};
