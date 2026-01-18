const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true // Allow null for anonymous consultations
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  projectType: {
    type: String,
    enum: ['Web', 'Mobile', 'AI', 'Cloud', 'Other'],
    required: true
  },
  description: {
    type: String,
    maxlength: 5000
  },
  budget: {
    type: String,
    enum: ['< $5k', '$5k - $25k', '$25k - $50k', '$50k - $100k', '> $100k']
  },
  timeline: {
    type: String,
    enum: ['ASAP', '1-3 months', '3-6 months', '6+ months']
  },
  conversationHistory: [{
    role: {
      type: String,
      enum: ['user', 'model']
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consultation', consultationSchema);
