const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');

// @desc    Register the single admin user
// @route   POST /api/v1/auth/register
// @access  Restricted — only allowed if no admin exists AND email matches ADMIN_EMAIL env var
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Only allow the pre-configured admin email
  const allowedEmail = process.env.ADMIN_EMAIL;
  if (!allowedEmail || email.toLowerCase() !== allowedEmail.toLowerCase()) {
    res.status(403);
    throw new Error('Registration is not allowed.');
  }

  // 2. Block if an admin already exists (single-admin policy)
  const adminExists = await User.findOne({});
  if (adminExists) {
    res.status(403);
    throw new Error('An administrator account already exists.');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'superadmin'
  });

  if (user) {
    sendTokenResponse(user, 201, res);
  } else {
    res.status(400);
    throw new Error('Invalid user data. Please try again.');
  }
});

// @desc    Auth admin & get token
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Save the login timestamp WITHOUT triggering the bcrypt pre-save hook
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update logged-in admin profile (name, email, phone, avatar)
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, avatar } = req.body;

  // If email is being changed, check it's not taken by another user
  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existing) {
      res.status(400);
      throw new Error('Email already in use by another account');
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, phone, avatar },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

// @desc    Change password for logged-in admin
// @route   POST /api/v1/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save(); // triggers bcrypt pre-save hook

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Log user out / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days hardcoded for cookie
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: user
    });
};
