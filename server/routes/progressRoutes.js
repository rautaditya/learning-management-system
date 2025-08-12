// const express = require('express');
// const router = express.Router();
// const { trackVideoProgress, trackExamCompletion, getCourseProgress } = require('../controllers/progressController'); // ✅ Import new function
// const studentProtect = require('../middleware/studentProtect');

// router.post('/track-video', studentProtect, trackVideoProgress);
// // ✅ NEW ROUTE: To track exam completion
// router.post('/track-exam', studentProtect, trackExamCompletion);
// router.get('/:courseId', studentProtect, getCourseProgress);

// module.exports = router;
// //this is 
// routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const { trackVideoProgress, trackExamCompletion, getCourseProgress } = require('../controllers/progressController'); // ✅ Import new function
const studentProtect = require('../middleware/studentProtect');

router.post('/track-video', studentProtect, trackVideoProgress);
// ✅ NEW ROUTE: To track exam completion
router.post('/track-exam', studentProtect, trackExamCompletion);
router.get('/:courseId', studentProtect, getCourseProgress);

module.exports = router;