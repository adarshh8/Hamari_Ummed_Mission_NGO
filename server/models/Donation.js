const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    name: {
      type: String,
      required: [true, 'Please add donor name']
    },
    email: {
      type: String,
      required: [true, 'Please add donor email']
    },
    phone: {
      type: String
    },
    pan: {
      type: String
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  purpose: {
    type: String,
    enum: ['general', 'books', 'clothes', 'coaching', 'event', 'elderly-care'],
    default: 'general'
  },
  amount: {
    type: Number,
    required: [true, 'Please add donation amount']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'cash', 'bank-transfer', 'cheque'],
    default: 'upi'
  },
  transactionId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'received', 'confirmed'],
    default: 'pending'
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  message: {
    type: String
  }
}, {
  timestamps: true
});

// Generate receipt number before save
donationSchema.pre('save', function(next) {
  if (!this.receiptNumber) {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.receiptNumber = `REC-${Date.now()}-${randomStr}`;
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
