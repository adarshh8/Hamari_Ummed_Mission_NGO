const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  caption: {
    type: String
  },
  location: {
    type: String
  },
  city: {
    type: String,
    default: 'Orai'
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['children', 'events', 'volunteers', 'elderly', 'awards']
  },
  featured: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);
