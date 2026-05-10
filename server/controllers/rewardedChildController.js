const RewardedChild = require('../models/RewardedChild');
const asyncHandler = require('express-async-handler');

// @desc    Get all rewarded children
// @route   GET /api/v1/rewarded-children
// @access  Public (admin gets all, public filters isPublic:true via query)
exports.getRewardedChildren = asyncHandler(async (req, res) => {
  const { limit, year } = req.query;
  const filter = {};
  // Only filter by isPublic if explicitly requested (public-facing site)
  if (req.query.publicOnly === 'true') {
    filter.isPublic = true;
  }
  if (year) {
    filter.year = Number(year);
  }
  const limitNum = parseInt(limit) || 200;
  const children = await RewardedChild.find(filter).sort({ year: -1, createdAt: -1 }).limit(limitNum);
  res.status(200).json({ success: true, count: children.length, data: children });
});

// @desc    Get rewarded children by year
// @route   GET /api/v1/rewarded-children/:year
// @access  Public
exports.getRewardedChildrenByYear = asyncHandler(async (req, res) => {
  const children = await RewardedChild.find({ year: req.params.year, isPublic: true });
  res.status(200).json({ success: true, count: children.length, data: children });
});

// @desc    Create rewarded child
// @route   POST /api/v1/rewarded-children
// @access  Private/Admin
exports.createRewardedChild = asyncHandler(async (req, res) => {
  const child = await RewardedChild.create(req.body);
  res.status(201).json({ success: true, data: child });
});

// @desc    Update rewarded child
// @route   PUT /api/v1/rewarded-children/:id
// @access  Private/Admin
exports.updateRewardedChild = asyncHandler(async (req, res) => {
  const child = await RewardedChild.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!child) {
    res.status(404);
    throw new Error('Record not found');
  }
  res.status(200).json({ success: true, data: child });
});

// @desc    Delete rewarded child
// @route   DELETE /api/v1/rewarded-children/:id
// @access  Private/Admin
exports.deleteRewardedChild = asyncHandler(async (req, res) => {
  const child = await RewardedChild.findById(req.params.id);
  if (!child) {
    res.status(404);
    throw new Error('Record not found');
  }
  await child.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
