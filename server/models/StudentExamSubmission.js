// models/StudentExamSubmission.js
const mongoose = require('mongoose');

const studentExamSubmissionSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [
    {
      questionIndex: Number,
      selectedOptionIndex: Number,
      isCorrect: Boolean,
      marksObtained: Number
    }
  ],
  totalMarksObtained: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentExamSubmission', studentExamSubmissionSchema);
