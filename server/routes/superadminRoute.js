// const express = require('express');
// const { approveCourse, getPendingCourses, addAdmin,getAllAdmins } = require('../controllers/superadminController');
// const { verifyToken } = require('../middleware/authMiddleware');
// const { uploadSingleImage } = require('../middleware/upload');
// const router = express.Router();
// const {addCourse}=require('../controllers/adminController');

// router.get('/courses/pending', verifyToken(['superadmin']), getPendingCourses);
// router.put('/courses/:id/approve', verifyToken(['superadmin']), approveCourse);
// router.post('/add-admin', verifyToken(['superadmin']), uploadSingleImage, addAdmin);



// router.get('/getalladmins', getAllAdmins);
// router.post('/addcourse', verifyToken(['superadmin']), uploadSingleImage, addCourse);

// router.put('/update-admin/:id', upload.single('profileImage'), superadminController.updateAdmin);
// router.delete('/delete-admin/:id', superadminController.deleteAdmin);

// module.exports = router;
  const express = require('express');
  const router = express.Router();
  const multer = require('multer');
  const path = require('path');

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/others');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, name + '-' + Date.now() + ext);
    }
  });

  const upload = multer({ storage }); // ✅ Define upload


  // Controllers
  const superadminController = require('../controllers/superadminController');
  const { addCourse } = require('../controllers/adminController');

  // Middleware
  const { verifyToken } = require('../middleware/authMiddleware');
  const { uploadSingleImage ,uploadAdminProfileImages,uploadProfileImage, uploadSingleVideo, uploadGeneric} = require('../middleware/upload');
  const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');


  // GET all courses — only accessible by superadmin
  router.get('/courses', authenticate, authorizeRoles('superadmin'), async (req, res) => {
    try {
      const courses = await Course.find();
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  // Course Routes (Superadmin)
  router.get('/courses/pending', verifyToken(['superadmin']), superadminController.getPendingCourses);
  // router.put('/courses/:id/approve', verifyToken(['superadmin']), superadminController.approveCourse);

  // Admin Management Routes
  router.post('/add-admin', verifyToken(['superadmin']), uploadProfileImage, superadminController.addAdmin);
  router.get('/getalladmins', verifyToken(['superadmin']), superadminController.getAllAdmins);
  router.put('/update-admin/:id', verifyToken(['superadmin']), uploadProfileImage, superadminController.updateAdmin);
  router.delete('/delete-admin/:id', verifyToken(['superadmin']), superadminController.deleteAdmin);

  // Course Creation Route (Optional if Superadmin can create)
  router.post('/courses', verifyToken(['admin', 'superadmin']), uploadSingleImage, addCourse);

  router.get('/getallcourses', superadminController.getAllCourses);
  router.get('/approvedcourses', superadminController.getApprovedCourses);

  // Route: GET /api/courses/:id - Get course by ID
  router.get('/course/:id', superadminController.getCourseById);

  // Route: PUT /api/courses/:id - Update course by ID
  // routes/superadmin.js or similar
  router.put('/courses/:id', uploadSingleImage, verifyToken(['superadmin']),superadminController.updateCourseController);

  // Route: DELETE /api/courses/:id - Delete course by ID
  router.delete('/course/:id', superadminController.deleteCourse);
  router.get('/course/:id', uploadSingleImage,verifyToken(['superadmin']),superadminController.getCourseById);

  router.post('/addassignment', verifyToken(['superadmin']), uploadGeneric.single('file'),superadminController.createAssignment);
  router.get('/getassignments', verifyToken(['superadmin']), superadminController.getAllAssignments);
  // router.put('/update-assignment/:id', verifyToken(['superadmin']), superadminController.updateAssignment);
  router.put('/update-assignment/:id',
    verifyToken(['superadmin']),
    upload.single('file'),       // MUST be here to parse file and form fields
    superadminController.updateAssignment
  );
  router.delete('/delete-assignment/:id', verifyToken(['superadmin']), superadminController.deleteAssignment);

  // router.get('/users', superadminController.getAllStudents);
  // router.put('/users/:id', superadminController.updateStudent);
  // router.delete('/users/:id', superadminController.deleteStudent);




  //video
  router.post('/uploadvideo', verifyToken(['superadmin']), uploadSingleVideo, superadminController.addVideo);
  router.get('/getallvideos', verifyToken(['superadmin']), superadminController.getAllVideos);
  router.put('/getallvideos/:id', verifyToken(['superadmin']), uploadSingleVideo, superadminController.updateVideo);
  router.delete('/getallvideos/:id', verifyToken(['superadmin']), superadminController.deleteVideo);
  router.get('/superadminprofile', verifyToken(['superadmin']), superadminController.getAdminProfile);
  router.put('/superadminprofile',verifyToken(['superadmin']),uploadAdminProfileImages,superadminController.updateSuperadminProfile);
  router.post('/study-material', verifyToken(['superadmin']), uploadGeneric.single('file'), superadminController.addStudyMaterial);

  module.exports = router;
