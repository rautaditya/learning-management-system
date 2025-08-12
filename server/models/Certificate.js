// =======================
// 1. models/Certificate.js
// =======================
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  templateName: {
    type: String,
    default: 'Course Completion'
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Issued', 'Revoked'],
    default: 'Issued'
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);