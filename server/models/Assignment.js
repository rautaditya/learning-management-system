const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    fileUrl: {
        type: String
    },
    dueDate: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    submissions: [
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, default: 'submitted' } // ← add this
  }
]
});

module.exports = mongoose.model('Assignment', assignmentSchema);
