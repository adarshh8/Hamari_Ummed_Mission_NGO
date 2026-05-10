const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
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
    type: String,
    required: [true, 'Please add your phone number']
  },
  city: {
    type: String,
    required: [true, 'Please add your city']
  },
  age: {
    type: Number,
    required: [true, 'Please add your age']
  },
  address: {
    type: String,
    required: [true, 'Please add your address in the city']
  },
  occupation: {
    type: String
  },
  skills: {
    type: [String],
    default: []
  },
  areaOfInterest: {
    type: [String],
    enum: ['teaching', 'event-help', 'door-to-door', 'elderly-care', 'content', 'photography', 'fundraising', 'other'],
    default: []
  },
  availability: {
    type: String
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
