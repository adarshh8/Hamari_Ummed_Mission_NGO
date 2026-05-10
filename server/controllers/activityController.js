const Activity = require('../models/Activity');
const asyncHandler = require('express-async-handler');

// @desc    Get all activities
// @route   GET /api/v1/activities
// @access  Public
exports.getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find();
  res.status(200).json({ success: true, count: activities.length, data: activities });
});

// @desc    Get single activity
// @route   GET /api/v1/activities/:slug
// @access  Public
exports.getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findOne({ slug: req.params.slug });
  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }
  res.status(200).json({ success: true, data: activity });
});

// @desc    Create activity
// @route   POST /api/v1/activities
// @access  Private/Admin
exports.createActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.create(req.body);
  res.status(201).json({ success: true, data: activity });
});

// @desc    Update activity
// @route   PUT /api/v1/activities/:id
// @access  Private/Admin
exports.updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }
  res.status(200).json({ success: true, data: activity });
});

// @desc    Delete activity
// @route   DELETE /api/v1/activities/:id
// @access  Private/Admin
exports.deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }
  await activity.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
