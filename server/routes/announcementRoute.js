const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { sendAnnouncement, getAnnouncementsForUserWithReplies,getAdminCourses,getAllAdmins,getAllSuperadmins,sendReply } = require("../controllers/announcementController");

router.post("/send",verifyToken(['admin', 'superadmin'] ), sendAnnouncement);
router.get("/user",verifyToken(['admin', 'superadmin', 'student'] ), getAnnouncementsForUserWithReplies);
router.get('/courses', verifyToken(['admin', 'superadmin'] ) , getAdminCourses);
router.get('/getalladmins', verifyToken(['admin', 'superadmin'] ), getAllAdmins);
router.get('/getallsuperadmins', verifyToken(['admin', 'superadmin'] ), getAllSuperadmins);

router.post("/reply",verifyToken(['admin', 'superadmin'] ), sendReply);


module.exports = router;