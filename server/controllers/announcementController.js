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
    const { role, targetId, message, senderId } = req.body;

    let recipients = [];

    if (role === "student") {
      if (targetId === "all") {
        recipients = await User.find({ role: "student" }, "_id");
      } else {
        recipients = await User.find({ role: "student", enrolledCourses: targetId }, "_id");
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
      sender: senderId,
      recipients: recipients.map(r => r._id)
    });

    await newAnnouncement.save();

    res.status(200).json({ 
      success: true, 
      message: "Announcement sent!", 
      recipientsCount: recipients.length 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getAnnouncementsForUser = async (req, res) => {
  try {
    const userId = req.user._id || req.user; 
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // fetch announcements where this user is in recipients
    const announcements = await Announcement.find({
      recipients: { $in: [userId] }
    })
      .sort({ createdAt: -1 });

    // Add current user as sender to each announcement
    const announcementsWithCurrentSender = announcements.map(announcement => {
      const announcementObj = announcement.toObject();
      announcementObj.sender = {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email
      };
      return announcementObj;
    });

    res.json(announcementsWithCurrentSender);
  } catch (err) {
    console.error("Error in getAnnouncementsForUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};


