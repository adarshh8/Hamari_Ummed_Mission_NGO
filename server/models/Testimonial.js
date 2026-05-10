const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['parent', 'child', 'volunteer', 'elder'],
    required: [true, 'Please add testimonial type']
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  relation: {
    type: String
  },
  area: {
    type: String
  },
  quote: {
    type: String,
    required: [true, 'Please add a quote'],
    maxlength: [1000, 'Quote can not be more than 1000 characters']
  },
  avatar: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  program: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
