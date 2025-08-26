const Course = require('../models/Course');
const User = require('../models/User'); 
const mongoose = require('mongoose');
const Announcement = require('../models/announcementModel');
const Enrollment = require("../models/Enrollment");




exports.getAdminCourses = async (req, res) => {
  try {
    const adminId = req.user.id;
    const courses = await Course.find({ createdBy: adminId });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Get Admin Courses Error:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.status(200).json(admins);
  } catch (error) {
    console.error('Get All Admins Error:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
};

exports.getAllSuperadmins = async (req, res) => {
  try {
    const superadmins = await User.find({ role: 'superadmin' });
    res.status(200).json(superadmins);
  } catch (error) {
    console.error('Get All Superadmins Error:', error);
    res.status(500).json({ message: 'Error fetching superadmins' });
  }
};

exports.sendAnnouncement = async (req, res) => {
  try {
    const { role, targetId, message } = req.body;

    let recipients = [];

    if (role === "student") {
      if (targetId === "all") {
        recipients = await User.find({ role: "student" }, "_id");
      } else {
        recipients = await User.find(
          { role: "student", enrolledCourses: targetId },
          "_id"
        );
      }
    } else {
      if (targetId === "all") {
        recipients = await User.find({ role }, "_id");
      } else {
        recipients = await User.find({ _id: targetId, role }, "_id");
      }
    }

    const newAnnouncement = new Announcement({
      role,
      targetId,
      message,
      sender: req.user._id, // ✅ always take sender from logged-in user
      recipients: recipients.map((r) => r._id),
    });

    await newAnnouncement.save();

    res.status(200).json({
      success: true,
      message: "Announcement sent!",
      recipientsCount: recipients.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// exports.getAnnouncementsForUser = async (req, res) => {
//   try {
//     const userId = req.user._id || req.user; 
//     const user = await User.findById(userId);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // fetch announcements where this user is in recipients
//     const announcements = await Announcement.find({
//       recipients: { $in: [userId] }
//     })
//       .populate("sender", "fullName email") // ✅ fetch actual sender details
//       .sort({ createdAt: -1 });

//     res.json(announcements);
//   } catch (err) {
//     console.error("Error in getAnnouncementsForUser:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// exports.getAnnouncementsForUserWithReplies = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Fetch announcements where user is in recipients
//     const announcements = await Announcement.find({
//       recipients: { $in: [userId] }
//     })
//       .populate("sender", "fullName email role") // 👈 get actual sender details
//       .populate("replies.sender", "fullName email role") // 👈 also populate reply sender
//       .sort({ createdAt: -1 });

//     res.json(announcements);
//   } catch (err) {
//     console.error("Error in getAnnouncementsForUserWithReplies:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.getAnnouncementsForUserWithReplies = async (req, res) => {
  try {
    const { dateRange } = req.query; // get date filter from query
    const filter = {
      $or: [
        { recipients: req.user._id }, // user received this announcement
        { sender: req.user._id },     // user created this announcement
      ],
    };

    if (dateRange && dateRange !== "all") {
      const now = new Date();
      let startDate;

      if (dateRange === "today") {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (dateRange === "7days") {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
      } else if (dateRange === "30days") {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
      }

      filter.createdAt = { $gte: startDate };
    }

    const announcements = await Announcement.find(filter)
      .populate("sender", "fullName email role")
      .populate("replies.sender", "fullName email role")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};











// ✅ Send Reply
// ✅ Send reply to an announcement
exports.sendReply = async (req, res) => {
  try {
    const { announcementId, message } = req.body;

    if (!announcementId || !message) {
      return res.status(400).json({
        success: false,
        message: "announcementId and message are required",
      });
    }

    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    // ✅ Push new reply
    announcement.replies.push({
      replyMessage: message,
      sender: req.user._id, // logged-in user
    });

    await announcement.save();

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      reply: {
        replyMessage: message,
        sender: req.user._id,
      },
    });
  } catch (err) {
    console.error("Error in sendReply:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};



