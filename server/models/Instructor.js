// const mongoose = require('mongoose');

// const instructorSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
//     },
//     department: {
//         type: String,
//         required: true,
//         trim: true
//     }
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('Instructor', instructorSchema);


const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    education: {
        type: String,
        required: true,
        trim: true
    },
    dateJoined: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Instructor', instructorSchema);
