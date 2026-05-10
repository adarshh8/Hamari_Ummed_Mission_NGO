const mongoose = require('mongoose');

const rewardedChildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add child name']
  },
  age: Number,
  school: String,
  class: String,
  percentage: String,
  grade: String,
  subject: String,
  award: String,
  photo: {
    type: String,
    required: [true, 'Please add a photo']
  },
  story: String,
  year: {
    type: Number,
    required: [true, 'Please specify the award year'],
    default: new Date().getFullYear()
  },
  eventRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RewardedChild', rewardedChildSchema);
