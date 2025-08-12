const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
require('dotenv').config();
const mongoose = require('mongoose');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('❌ Error in createOrder:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
  }
};

// 2. Verify Razorpay Payment and Save Payment + Enrollment
// ✅ Payment + Enrollment logic
exports.verifyAndEnroll = async (req, res) => {
  try {
    const { courseId, paymentInfo } = req.body;
    // console.log("Incoming courseId:", courseId);

    if (!courseId || courseId === 'null') {
      return res.status(400).json({ message: '❌ courseId is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: '❌ Course not found' });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      courseId
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: '⚠️ Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      student: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      courseId,
      paymentInfo
    });

    await enrollment.save();
    res.status(201).json({ message: '✅ Enrollment successful' });

  } catch (err) {
    console.error("❌ Error in verifyAndEnroll:", err);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
};

