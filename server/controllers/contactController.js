const Contact = require('../models/Contact');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact message
// @route   POST /api/v1/contact
// @access  Public
exports.createMessage = asyncHandler(async (req, res) => {
  const message = await Contact.create(req.body);

  // Send auto-reply to sender
  try {
    await sendEmail({
      email: message.email,
      subject: 'Message Received - Hamari Ummeed Mission',
      message: `<h1>Thank you for reaching out!</h1><p>We have received your message and will get back to you shortly.</p>`
    });
  } catch (err) {
    console.error('Email could not be sent', err);
  }

  res.status(201).json({ success: true, data: message });
});

// @desc    Get all messages
// @route   GET /api/v1/contact
// @access  Private/Admin
exports.getMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find().sort('-createdAt');
  res.status(200).json({ success: true, count: messages.length, data: messages });
});

// @desc    Update message status
// @route   PUT /api/v1/contact/:id
// @access  Private/Admin
exports.updateMessage = asyncHandler(async (req, res) => {
  const message = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  res.status(200).json({ success: true, data: message });
});

// @desc    Delete message
// @route   DELETE /api/v1/contact/:id
// @access  Private/Admin
exports.deleteMessage = asyncHandler(async (req, res) => {
  const message = await Contact.findByIdAndDelete(req.params.id);
  
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  res.status(200).json({ success: true, data: {} });
});
