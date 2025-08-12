// models/CourseProgress.js
const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  completedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video', // Assuming Video model or direct video ID reference
  }],
  // ✅ NEW: To track completed exams
  completedExams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam', // Reference to your Exam model
  }], 
  progress: {
    type: Number,
    default: 0,
  },
certificateIssued: {
  type: Boolean,
  default: false,
}


}, { timestamps: true });

module.exports = mongoose.model('CourseProgress', courseProgressSchema);