const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    courseImage: String,
    priceType: String, // "Free" or "Paid"
    price: Number,
    instructor: String,
    duration: String,
    level: String,
    syllabus: String,
    prerequisites: String,
    language: String,
    certification: String,
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    approved: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // assuming superadmin is also a user
    },
    approvedAt: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Course', courseSchema);
