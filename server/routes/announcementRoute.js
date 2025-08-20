const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { sendAnnouncement, getAnnouncementsForUser,getAdminCourses,getAllAdmins,getAllSuperadmins } = require("../controllers/announcementController");

router.post("/send",verifyToken(['admin', 'superadmin'] ), sendAnnouncement);
router.get("/user/:userId",verifyToken(['admin', 'superadmin'] ), getAnnouncementsForUser);
router.get('/courses', verifyToken(['admin', 'superadmin'] ) , getAdminCourses);
router.get('/getalladmins', verifyToken(['admin', 'superadmin'] ), getAllAdmins);
router.get('/getallsuperadmins', verifyToken(['admin', 'superadmin'] ), getAllSuperadmins);


module.exports = router;