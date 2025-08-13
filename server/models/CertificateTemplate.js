// models/CertificateTemplate.js
const mongoose = require('mongoose');

const certificateTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. Course Completion
  description: { type: String },
  imageUrl: { type: String, required: true }, // stored path or public URL
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null }, // optional pre-linked course
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('CertificateTemplate', certificateTemplateSchema);
