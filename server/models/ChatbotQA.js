// models/HelpRequest.js
const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  name: { type: String },
  mobile: { type: String },
  email: { type: String },
  problem: { type: String },
  step: { type: Number, default: 1 }, // 1 = name, 2 = mobile, 3 = email, 4 = problem
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
