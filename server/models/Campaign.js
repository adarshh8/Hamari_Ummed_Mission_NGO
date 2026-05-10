const mongoose = require('mongoose');
const slugify = require('slugify');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a campaign title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  fullDescription: {
    type: String,
    required: [true, 'Please add a full description']
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['Education', 'Health', 'Water', 'Environment', 'Empowerment', 'Emergency']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please add a target amount']
  },
  raisedAmount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  coverImage: {
    type: String,
    required: [true, 'Please add a cover image']
  },
  gallery: {
    type: [String],
    default: []
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  donorCount: {
    type: Number,
    default: 0
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  tags: {
    type: [String]
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create campaign slug from the title
campaignSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Campaign', campaignSchema);
