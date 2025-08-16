const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure 'User' matches the model name in your user schema
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  templateName: String,
  issuedDate: Date,
  status: {
    type: String,
    enum: ['Issued', 'Revoked'],
    default: 'Issued'
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
