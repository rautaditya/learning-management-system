const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'student' },
  status: { type: String, default: 'active' },

  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

  enrolledAt: { type: Date, default: Date.now },

  paymentInfo: {
    orderId: { type: String },
    paymentId: { type: String },
    amount: { type: Number },
    method: { type: String, default: 'Razorpay' },
    paymentDate: { type: Date, default: Date.now }
  }
});

// ✅ Ensure index is on courseId not course
enrollmentSchema.index({ student: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
