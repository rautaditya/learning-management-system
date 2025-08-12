const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ==========================
// Send OTP to Student Email
// ==========================
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'student') {
      return res.status(404).json({ message: "Student not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for LMS Login',
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send OTP', error });
      }
      return res.status(200).json({ message: 'OTP sent successfully' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==========================
// Student Login (OTP Based)
// ==========================
exports.studentLogin = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'student') {
      return res.status(404).json({ message: "Student not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, user: { id: user._id, name: user.fullName, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ====================================
// Admin or Superadmin Login (Password)
// ====================================
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !['admin', 'superadmin'].includes(user.role)) {
      return res.status(404).json({ message: "Admin or Superadmin not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, user: { id: user._id, name: user.fullName, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==========================
// Signup (All Roles)
// ==========================
exports.signup = async (req, res) => {
  const { fullName, username, email, password, role } = req.body;

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create new user with current date as joiningDate
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      role,
      joiningDate: new Date().toISOString(), // ISO format
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==========================
// Optional: Combined Login
// ==========================
exports.login = async (req, res) => {
  const { username, password, email, otp } = req.body;

  try {
    // Student login
    if (email && otp) {
      const user = await User.findOne({ email });
      if (!user || user.role !== 'student') {
        return res.status(404).json({ message: "Student not found" });
      }

      if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, user: { id: user._id, name: user.fullName, role: user.role } });
    }

    // Admin or superadmin login
    if (username && password) {
      const user = await User.findOne({ username });
      if (!user || !['admin', 'superadmin'].includes(user.role)) {
        return res.status(404).json({ message: "Admin or Superadmin not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, user: { id: user._id, name: user.fullName, role: user.role } });
    }

    return res.status(400).json({ message: "Missing credentials" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// ==========================
// Logout (Token Invalidation)
// ==========================
exports.logout = async (req, res) => {
  try {
    // Instruct client to delete the token
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
