const mongoose = require('mongoose');
const slugify = require('slugify');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an activity title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  slug: String,
  icon: {
    type: String 
  },
  shortDescription: {
    type: String,
    required: [true, 'Please add a short description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  fullDescription: {
    type: String,
    required: [true, 'Please add a full description']
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['education', 'elderly', 'awareness', 'cultural']
  },
  coverImage: {
    type: String,
    default: ''
  },
  stats: {
    childrenHelped: { type: String, default: '0' },
    familiesReached: { type: String, default: '0' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create activity slug from the title
activitySchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Activity', activitySchema);
