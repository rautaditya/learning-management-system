
const express = require('express');
const commonController = require('../controllers/commonController');
const router = express.Router();
const { authorizeRoles } = require('../middleware/authMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

const {
  createAssignment, addVideoToCourse, getAllVideos,
  getAllAssignments, updateAssignment, deleteAssignment,updateVideo,deleteVideo,getAllStudents,updateStudent,deleteStudent,getDashboardStats,addStudyMaterial
,getCourseEnrollmentsWithProgress,getStudentCourseProgress} = require('../controllers/commonController');

const {
  uploadSingleVideo,
  uploadSingleImage,
  uploadGeneric
} = require('../middleware/upload');

// Assignment Routes
router.post('/assignments', verifyToken(['admin']), uploadGeneric.single('file'), createAssignment);
router.get('/assignments', verifyToken(['admin']), getAllAssignments);
router.put('/assignments/:id', uploadGeneric.single('file'), verifyToken(['admin']), updateAssignment);
router.delete('/assignments/:id', verifyToken(['admin']), deleteAssignment);

// Video Upload Route
router.post('/addvideo', verifyToken(['admin']), uploadSingleVideo, addVideoToCourse);
router.get('/videos', verifyToken(['admin']), getAllVideos);
router.put('/videos/:id', verifyToken(['admin']), uploadSingleVideo, updateVideo);
router.delete('/videos/:id', verifyToken(['admin']), deleteVideo);

router.get("/users", verifyToken(['superadmin', 'admin']), commonController.getAllStudents);
router.put('/users/:id', verifyToken(['superadmin', 'admin']),commonController.updateStudent);
router.delete('/users/:id', verifyToken(['superadmin', 'admin']), commonController.deleteStudent);
router.get('/enrollments', verifyToken(['superadmin', 'admin']), commonController.getAllEnrollments);
router.get('/dashboard-stats', commonController.getDashboardStats);
// router.get('/addstudy-material', verifyToken(['superadmin', 'admin']),commonController.addStudyMaterial);
router.get('/course/:courseId/enrollments', verifyToken(['superadmin', 'admin']), getCourseEnrollmentsWithProgress);
router.get('/progress/:courseId/:studentId', verifyToken(['admin', 'superadmin']), getStudentCourseProgress);
router.get('/courses/all', verifyToken(['superadmin', 'admin']),commonController.getAllCourses);
router.get('/course-progress/:courseId', commonController.getCourseStudents);
router.get('/progress/full/:courseId/:studentId', verifyToken(['admin', 'superadmin']), commonController.getFullStudentProgress);
router.get('/course-progress/all', verifyToken(['admin', 'superadmin']), commonController.getAllCourseStudents);
router.post('/course-category', verifyToken(['admin', 'superadmin'],), commonController.createCourseCategory);

module.exports = router;
