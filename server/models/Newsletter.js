const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  name: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active'
  },
  source: {
    type: String,
    default: 'Website Footer'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
