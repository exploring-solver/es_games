const User = require('../models/User');
const { sendTokenResponse } = require('../middleware/auth');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new ErrorResponse('User already exists with this email or username', 400));
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Update online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // Update user status
    req.user.isOnline = false;
    req.user.lastSeen = new Date();
    await req.user.save();

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('achievements');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      username: req.body.username,
      email: req.body.email,
      bio: req.body.bio,
      avatar: req.body.avatar
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
exports.updatePreferences = async (req, res, next) => {
  try {
    const { notifications, soundEnabled, theme } = req.body;

    const user = await User.findById(req.user.id);

    if (notifications !== undefined) user.preferences.notifications = notifications;
    if (soundEnabled !== undefined) user.preferences.soundEnabled = soundEnabled;
    if (theme !== undefined) user.preferences.theme = theme;

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add friend
// @route   POST /api/auth/friends/:userId
// @access  Private
exports.addFriend = async (req, res, next) => {
  try {
    const friendId = req.params.userId;

    if (friendId === req.user.id) {
      return next(new ErrorResponse('Cannot add yourself as a friend', 400));
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return next(new ErrorResponse('User not found', 404));
    }

    const user = await User.findById(req.user.id);

    if (user.friends.includes(friendId)) {
      return next(new ErrorResponse('User is already your friend', 400));
    }

    user.friends.push(friendId);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.friends
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove friend
// @route   DELETE /api/auth/friends/:userId
// @access  Private
exports.removeFriend = async (req, res, next) => {
  try {
    const friendId = req.params.userId;
    const user = await User.findById(req.user.id);

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.friends
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile/:userId
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('achievements');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
