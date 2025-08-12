const User = require('../models/User');

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.role !== 'student') {
    return res.status(404).json({ message: 'Student not found' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  // Mock OTP sending
  console.log(`OTP for ${email}: ${otp}`);

  res.json({ message: 'OTP sent to email (mock)' });
};
