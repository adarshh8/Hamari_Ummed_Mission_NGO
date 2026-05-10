const mongoose = require('mongoose');
const slugify = require('slugify');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  eventType: {
    type: String,
    required: [true, 'Please specify event type'],
    enum: ['Reward Ceremony', 'Play / Drama', 'Book Distribution', 'Clothes Drive', 'Door-to-Door Campaign', 'Other']
  },
  date: {
    type: Date,
    required: [true, 'Please specify event date']
  },
  time: {
    type: String,
    required: [true, 'Please specify event time']
  },
  venue: {
    type: String,
    required: [true, 'Please specify venue name']
  },
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: 'Orai'
  },
  coverImage: {
    type: String,
    required: [true, 'Please add a cover image']
  },
  gallery: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  childrenParticipated: {
    type: Number,
    default: 0
  },
  volunteersInvolved: {
    type: Number,
    default: 0
  },
  highlights: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Create event slug from the title
eventSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Event', eventSchema);
