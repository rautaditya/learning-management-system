const User = require("../models/User");
const sendOTP = require("../utils/sendOTP"); // assume this uses nodemailer
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup (Only for Student)
exports.studentSignup = async (req, res) => {
  const { fullName, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "Account already exists. Please log in." });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 mins

    const newUser = new User({
      fullName,
      email,
      role: "student",
      otp,
      otpExpires: otpExpiry
    });

    await newUser.save();
    await sendOTP(email, otp);

    res.status(200).json({ msg: "OTP sent to your email for verification." });

  } catch (err) {
    res.status(500).json({ msg: "Signup failed", error: err.message });
  }
};

// Request OTP for Login (Email Only)
exports.studentRequestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email, role: "student" });

    if (!user) {
      return res.status(404).json({ msg: "You don't have an account. Please sign up first." });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60000);

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    await sendOTP(email, otp);

    res.status(200).json({ msg: "OTP sent to your email." });

  } catch (err) {
    res.status(500).json({ msg: "Failed to send OTP", error: err.message });
  }
};

// Verify OTP and Log In
exports.studentVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email, role: "student" });

    if (
      !user ||
      !user.otp ||
      !user.otpExpires ||
      String(user.otp) !== String(otp) ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ msg: "Invalid or expired OTP." });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    // Optional: generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "OTP verification failed", error: err.message });
  }
};


// Check if student email exists (for login/signup decision)
exports.checkStudentEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email, role: 'student' });

    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    return res.status(500).json({ msg: 'Error checking email', error: err.message });
  }
};
