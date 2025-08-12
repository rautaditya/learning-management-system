const express = require('express');
const router = express.Router();
const {
  signup,
  login,         // optional: if you still want the combined logic
  adminLogin,
  studentLogin,
  logout
} = require('../controllers/authController');

// Signup route (shared for all)
router.post('/signup', signup);

// Combined login route (optional, if you're still using it)
router.post('/login', login);

// Separate login routes for clarity
router.post('/student/login', studentLogin);
// router.post('/admin/login', adminLogin);
// router.post('/superadmin/login', adminLogin); // same handler as adminLogin
router.post('/admin-superadmin-login', adminLogin); // same handler as login
router.post('/logout', logout);


module.exports = router;
