const Program = require('../models/Program');
const asyncHandler = require('express-async-handler');

// @desc    Get all programs
// @route   GET /api/v1/programs
// @access  Public
exports.getPrograms = asyncHandler(async (req, res) => {
  const programs = await Program.find();
  res.status(200).json({ success: true, count: programs.length, data: programs });
});

// @desc    Get featured programs
// @route   GET /api/v1/programs/featured
// @access  Public
exports.getFeaturedPrograms = asyncHandler(async (req, res) => {
  // If no 'featured' field in schema, we'll just return the first 6
  // Or if it exists, find({ featured: true }). For now, return 6 programs.
  const programs = await Program.find().limit(6);
  res.status(200).json({ success: true, count: programs.length, data: programs });
});

// @desc    Get single program
// @route   GET /api/v1/programs/:slug
// @access  Public
exports.getProgram = asyncHandler(async (req, res) => {
  const program = await Program.findOne({ slug: req.params.slug });
  if (!program) {
    res.status(404);
    throw new Error('Program not found');
  }
  res.status(200).json({ success: true, data: program });
});

// @desc    Create program
// @route   POST /api/v1/programs
// @access  Private/Admin
exports.createProgram = asyncHandler(async (req, res) => {
  const program = await Program.create(req.body);
  res.status(201).json({ success: true, data: program });
});

// @desc    Update program
// @route   PUT /api/v1/programs/:id
// @access  Private/Admin
exports.updateProgram = asyncHandler(async (req, res) => {
  const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!program) {
    res.status(404);
    throw new Error('Program not found');
  }
  res.status(200).json({ success: true, data: program });
});

// @desc    Delete program
// @route   DELETE /api/v1/programs/:id
// @access  Private/Admin
exports.deleteProgram = asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);
  if (!program) {
    res.status(404);
    throw new Error('Program not found');
  }
  await program.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
