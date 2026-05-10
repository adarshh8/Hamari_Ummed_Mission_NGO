const Newsletter = require('../models/Newsletter');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');

// @desc    Subscribe to newsletter
// @route   POST /api/v1/newsletter/subscribe
// @access  Public
exports.subscribe = asyncHandler(async (req, res) => {
  const { email, name } = req.body;

  let subscriber = await Newsletter.findOne({ email });

  if (subscriber) {
    if (subscriber.status === 'unsubscribed') {
      subscriber.status = 'active';
      await subscriber.save();
      return res.status(200).json({ success: true, message: 'Re-subscribed successfully', data: subscriber });
    }
    res.status(400);
    throw new Error('Already subscribed');
  }

  subscriber = await Newsletter.create({ email, name });

  // Send welcome email
  try {
    await sendEmail({
      email: subscriber.email,
      subject: 'Welcome to Hamari Ummeed Mission Newsletter!',
      message: `<h1>Welcome!</h1><p>Thank you for subscribing to our newsletter. We'll keep you updated on our latest impact.</p>`
    });
  } catch (err) {
    console.error('Email could not be sent', err);
  }

  res.status(201).json({ success: true, data: subscriber });
});

// @desc    Unsubscribe from newsletter
// @route   POST /api/v1/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const subscriber = await Newsletter.findOne({ email });

  if (!subscriber) {
    res.status(404);
    throw new Error('Subscriber not found');
  }

  subscriber.status = 'unsubscribed';
  subscriber.unsubscribedAt = Date.now();
  await subscriber.save();

  res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
});

// @desc    Get all subscribers
// @route   GET /api/v1/newsletter/subscribers
// @access  Private/Admin
exports.getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find({ status: 'active' });
  res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
});
