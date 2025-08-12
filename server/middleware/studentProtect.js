// middleware/studentProtect.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming your User model is here

const studentProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    // Verify the token using your JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    // Find the user by ID and ensure they have the 'student' role
    const student = await User.findById(decoded.id).select('-password');

    if (!student || student.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized: Not a student or user not found' });
    }

    req.user = student; // Attach the student object to the request
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = studentProtect;