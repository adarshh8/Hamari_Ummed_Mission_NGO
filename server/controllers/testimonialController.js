const Testimonial = require('../models/Testimonial');
const asyncHandler = require('express-async-handler');

// @desc    Get all testimonials (Public gets approved only)
// @route   GET /api/v1/testimonials
// @access  Public
exports.getTestimonials = asyncHandler(async (req, res) => {
  let query = { status: 'approved' };
  
  // Admin requested? Might need to check req.user if we want an admin route, or just create a separate route.
  // For simplicity, we just return approved ones for public.

  const testimonials = await Testimonial.find(query).populate('program', 'title');
  res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
});

// @desc    Get all testimonials (Admin)
// @route   GET /api/v1/testimonials/admin
// @access  Private/Admin
exports.getAdminTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().populate('program', 'title');
  res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
});

// @desc    Create testimonial
// @route   POST /api/v1/testimonials
// @access  Public
exports.createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: testimonial });
});

// @desc    Update testimonial status
// @route   PUT /api/v1/testimonials/:id
// @access  Private/Admin
exports.updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  res.status(200).json({ success: true, data: testimonial });
});

// @desc    Delete testimonial
// @route   DELETE /api/v1/testimonials/:id
// @access  Private/Admin
exports.deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }
  await testimonial.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
