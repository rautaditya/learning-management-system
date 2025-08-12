const express = require('express');
const router = express.Router();
const contactController = require('../controllers/commonController');

// POST - Submit form
router.post('/contact', contactController.submitContactForm);

// GET - Get all messages (optional)
router.get('/contact', contactController.getAllMessages);

module.exports = router;
