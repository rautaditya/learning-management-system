const mongoose = require('mongoose');
const examSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  totalMarks: { type: Number, required: true },
  questions: [
    {
      questionText: String,
      options: [String],
      correctOptionIndex: Number,
      marks: Number
    }
  ],
  examDueDate: { type: Date, required: true }, // ✅ NEW FIELD
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Exam', examSchema);