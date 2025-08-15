const {getApprovedCourses, getCourseById,getUserProfile} = require('../controllers/studentController');
const express = require('express');
const router = express.Router();
const {
  studentSignup,
  studentRequestOTP,
  studentVerifyOTP,
  checkStudentEmail
} = require('../controllers/studentAuthController');
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const studentProtect = require('../middleware/studentProtect');
const { uploadSingleImage, uploadAdminProfileImages } = require('../middleware/upload'); // Fixed importort

router.post('/signup', studentSignup);
router.post('/send-otp', studentRequestOTP);
router.post('/verify-otp', studentVerifyOTP);
router.post('/check-email', checkStudentEmail); // 👈 Add this line


router.get('/courses', getApprovedCourses);
// router.get('/courses/student', studentController.getApprovedCourses);

// Route to get individual course by ID
router.get('/courses/:id', getCourseById);
router.get('/enrollments', protect, studentController.getEnrollments);
router.get('/my-learning', studentProtect, studentController.getMyEnrolledCourses);
router.get('/profile', studentProtect, studentController.getUserProfile);
router.put('/profile/:id', studentProtect,uploadAdminProfileImages, studentController.updateUserProfile);


router.get('/course/:id', studentProtect,studentController.getStudentCourseById);


// Route to get assignments by enrolled course ID
// router.get('/assignments/:enrollmentId', studentController.getAssignmentsByEnrollmentId);
// routes/studentRoute.js

// router.get('/assignments/:enrollmentId', studentController.getAssignmentsByEnrollmentId);

// routes/student.js
router.get('/assignments', studentProtect, studentController.getMyAssignments);
router.get('/enrolled-exams/:studentId', studentProtect, studentController.getEnrolledExams);

router.get('/my-enrollments', studentProtect, studentController.getMyEnrollments); // Use studentprotect, getMyEnrollments);
// router.get("/purchased", studentProtect, studentController.getPurchasedCourses);

module.exports = router;