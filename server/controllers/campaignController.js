const Campaign = require('../models/Campaign');
const asyncHandler = require('express-async-handler');

// @desc    Get all campaigns
// @route   GET /api/v1/campaigns
// @access  Public
exports.getCampaigns = asyncHandler(async (req, res) => {
  let query;
  
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Campaign.find(JSON.parse(queryStr)).populate('createdBy', 'name');

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Campaign.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const campaigns = await query;

  res.status(200).json({
    success: true,
    count: campaigns.length,
    pagination: { page, limit, total },
    data: campaigns
  });
});

// @desc    Get featured campaigns
// @route   GET /api/v1/campaigns/featured
// @access  Public
exports.getFeaturedCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ featured: true, status: 'active' }).limit(3);
  res.status(200).json({ success: true, data: campaigns });
});

// @desc    Get single campaign
// @route   GET /api/v1/campaigns/:slug
// @access  Public
exports.getCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({ slug: req.params.slug }).populate('createdBy', 'name');

  if (!campaign) {
    res.status(404);
    throw new Error(`Campaign not found with slug of ${req.params.slug}`);
  }

  res.status(200).json({ success: true, data: campaign });
});

// @desc    Create new campaign
// @route   POST /api/v1/campaigns
// @access  Private/Admin
exports.createCampaign = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user.id;
  
  if (req.file) {
    req.body.coverImage = req.file.path;
  }

  const campaign = await Campaign.create(req.body);

  res.status(201).json({ success: true, data: campaign });
});

// @desc    Update campaign
// @route   PUT /api/v1/campaigns/:id
// @access  Private/Admin
exports.updateCampaign = asyncHandler(async (req, res) => {
  if (req.file) {
    req.body.coverImage = req.file.path;
  }

  let campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!campaign) {
    res.status(404);
    throw new Error(`Campaign not found with id of ${req.params.id}`);
  }

  res.status(200).json({ success: true, data: campaign });
});

// @desc    Delete campaign
// @route   DELETE /api/v1/campaigns/:id
// @access  Private/Admin
exports.deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error(`Campaign not found with id of ${req.params.id}`);
  }

  await campaign.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
