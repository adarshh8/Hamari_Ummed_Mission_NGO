const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

// @desc    Get all events
// @route   GET /api/v1/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res) => {
  const { limit, search, type, status } = req.query;

  // Build filter object using only valid schema fields
  const filter = {};

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }
  if (type && type !== 'all') {
    filter.eventType = type; // frontend sends the human-readable label e.g. 'Reward Ceremony'
  }
  if (status && status !== 'all') {
    filter.status = status;
  }

  const limitNum = parseInt(limit) || 100;

  const events = await Event.find(filter).sort({ date: 1 }).limit(limitNum);
  res.status(200).json({ success: true, count: events.length, data: events });
});

// @desc    Get upcoming events
// @route   GET /api/v1/events/upcoming
// @access  Public
exports.getUpcomingEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: 'upcoming', date: { $gte: new Date() } }).sort({ date: 1 }).limit(3);
  res.status(200).json({ success: true, count: events.length, data: events });
});

// @desc    Get single event
// @route   GET /api/v1/events/:id  (accepts slug or ObjectId)
// @access  Public
exports.getEvent = asyncHandler(async (req, res) => {
  const param = req.params.id;
  // Try finding by ObjectId first, then by slug
  const mongoose = require('mongoose');
  let event;
  if (mongoose.Types.ObjectId.isValid(param)) {
    event = await Event.findById(param);
  }
  if (!event) {
    event = await Event.findOne({ slug: param });
  }
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  res.status(200).json({ success: true, data: event });
});

// @desc    Create event
// @route   POST /api/v1/events
// @access  Private/Admin
exports.createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json({ success: true, data: event });
});

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
exports.updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  res.status(200).json({ success: true, data: event });
});

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
exports.deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  await event.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
