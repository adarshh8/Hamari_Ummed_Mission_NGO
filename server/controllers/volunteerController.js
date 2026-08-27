const Volunteer = require('../models/Volunteer');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');

// @desc    Create volunteer application
// @route   POST /api/v1/volunteers
// @access  Public
exports.createVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.create(req.body);

  // Send confirmation email
  try {
    await sendEmail({
      email: volunteer.email,
      subject: 'Volunteer Application Received - Hamari Ummeed Mission',
      message: `<h1>Thank you for applying!</h1><p>We have received your application and will review it shortly.</p>`
    });
  } catch (err) {
    console.error('Email could not be sent', err);
  }

  res.status(201).json({ success: true, data: volunteer });
});

// @desc    Get all volunteers
// @route   GET /api/v1/volunteers
// @access  Private/Admin
exports.getVolunteers = asyncHandler(async (req, res) => {
  const queryObj = {};
  if (req.query.status && req.query.status.toLowerCase() !== 'all') {
    queryObj.status = req.query.status.toLowerCase();
  }
  if (req.query.interest && req.query.interest.toLowerCase() !== 'all') {
    queryObj.areaOfInterest = req.query.interest;
  }
  if (req.query.search) {
    queryObj.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { phone: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  let query = Volunteer.find(queryObj).sort('-createdAt');
  if (req.query.limit) {
    query = query.limit(parseInt(req.query.limit, 10));
  }

  const volunteers = await query;
  res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
});

// @desc    Update volunteer status
// @route   PUT /api/v1/volunteers/:id/status
// @access  Private/Admin
exports.updateVolunteerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, { status }, { new: true });
  
  if (!volunteer) {
    res.status(404);
    throw new Error('Volunteer not found');
  }

  res.status(200).json({ success: true, data: volunteer });
});

// @desc    Update volunteer details (e.g. adminNotes, assignedProgram)
// @route   PUT /api/v1/volunteers/:id
// @access  Private/Admin
exports.updateVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  
  if (!volunteer) {
    res.status(404);
    throw new Error('Volunteer not found');
  }

  res.status(200).json({ success: true, data: volunteer });
});

// @desc    Delete volunteer
// @route   DELETE /api/v1/volunteers/:id
// @access  Private/Admin
exports.deleteVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);

  if (!volunteer) {
    res.status(404);
    throw new Error('Volunteer not found');
  }

  await volunteer.deleteOne();
  
  res.status(200).json({ success: true, data: {} });
});
