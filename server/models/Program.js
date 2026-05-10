const mongoose = require('mongoose');
const slugify = require('slugify');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a program title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  slug: String,
  icon: {
    type: String // name of the lucide-react icon or image URL
  },
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
  coverImage: {
    type: String,
    required: [true, 'Please add a cover image']
  },
  stats: {
    beneficiaries: { type: String, default: '0' },
    projects: { type: String, default: '0' },
    countries: { type: String, default: '1' }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'planned'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  gallery: {
    type: [String],
    default: []
  },
  partners: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create program slug from the title
programSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Program', programSchema);
