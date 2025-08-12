const express = require('express');
const router = express.Router();
const {
  getAllCertificates,
  getCertificatesByStudent
} = require('../controllers/certificateController');

router.get('/', getAllCertificates); // admin view
router.get('/student/:studentId', getCertificatesByStudent); // student view

module.exports = router;
