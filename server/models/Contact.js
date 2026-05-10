const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name']
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  message: {
    type: String,
    required: [true, 'Please add a message']
  },
  category: {
    type: String,
    enum: ['General', 'Donation', 'Volunteering', 'Partnership', 'Media'],
    default: 'General'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  adminNotes: {
    type: String
  },
  repliedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
