const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');     // JWT middleware
const paymentCtrl = require('../controllers/paymentController');

router.post('/create-order', protect, paymentCtrl.createOrder);
router.post('/verify',protect, paymentCtrl.verifyAndEnroll);

module.exports = router;
