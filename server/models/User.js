const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String },
password: { type: String },

  profileImage: { type: String },
  backgroundImage: { type: String },
  role: {
    type: String,
    enum: ['student', 'admin', 'superadmin'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  gender: { type: String },
  dob: { type: Date },
  address: { type: String },
  joiningDate: { type: Date,default: Date.now },
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  username: { type: String, unique: true, sparse: true }
});

module.exports = mongoose.model('User', UserSchema);
