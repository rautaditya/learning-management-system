
// const mongoose = require('mongoose');

// const videoSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   videoPath: { type: String, required: true },
//   duration: String,
//   uploadedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   course: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course', // This is necessary for .populate('course') to work
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Video', videoSchema);

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  description: String,
  duration: String,
  videoPath: String
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.Video || mongoose.model('Video', videoSchema);
