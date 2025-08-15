
const express = require('express');
const router = express.Router();
const { addCourse, getAdminCourses, updateCourse, deleteCourse ,createExam,getExam,updateExam,deleteExam,getAdminProfile,getAllEnrollments,updateAdminProfile,getCourseCompletionReport,getExamCompletionReport,getAssignmentSubmissions} = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadSingleImage, uploadAdminProfileImages, uploadSingleVideo, uploadGeneric } = require('../middleware/upload'); // Fixed importort



// Add course (Admin) with image
router.post('/courses', verifyToken(['admin']), uploadSingleImage, addCourse);

// Get admin courses
router.get('/courses', verifyToken(['admin', 'superadmin'] ) , getAdminCourses);

// Update course (Admin) with image
router.put('/courses/:id', verifyToken(['admin']), uploadSingleImage, updateCourse);

// Delete course
router.delete('/courses/:id', verifyToken(['admin']), deleteCourse);

// router.post('/createexam', verifyToken(['admin']), createExam);
router.post('/createexam', verifyToken(['admin', 'superadmin']), createExam);

router.get('/exams', verifyToken(['admin', 'superadmin']) , getExam);
// router.get('/exams/:id', verifyToken(['admin']),adminController.getExamById);

router.put('/exam/:id',verifyToken(['admin', 'superadmin']) ,updateExam);
router.delete('/exam/:examId',verifyToken(['admin', 'superadmin']), deleteExam);

router.get('/adminprofile', verifyToken(['admin']), getAdminProfile);
router.get('/enrolledcourses', verifyToken(['admin']), getAllEnrollments);
router.put('/adminprofile',verifyToken(['admin']),uploadAdminProfileImages,updateAdminProfile);
router.get('/completion/:courseId',verifyToken(['admin']), getCourseCompletionReport);
router.get('/exam-completion/:examId',verifyToken(['admin']), getExamCompletionReport);
router.get('/assignment/:assignmentId',verifyToken(['admin']), getAssignmentSubmissions);





module.exports = router;