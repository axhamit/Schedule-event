const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRecurring: {         
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', null],
    default: null
  },
  repeatUntil: {
    type: Date,
    default: null
  },
  location: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

appointmentSchema.index({ user: 1, startTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
