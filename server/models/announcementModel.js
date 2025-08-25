  const mongoose = require("mongoose");

  const announcementSchema = new mongoose.Schema({
    role: { type: String, enum: ["student", "admin", "superadmin"], required: true },
    targetId: { type: String, required: true }, // "all" or specific course/user ID
    message: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who sent
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // who received
    replies: [ {
       replyMessage: { type: String, required: true },
       sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
       createdAt: { type: Date, default: Date.now } } ],
    createdAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model("Announcement", announcementSchema);
