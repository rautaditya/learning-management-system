// routes/helpChatbotRoutes.js
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { verifyToken } = require('../middleware/authMiddleware');

// Start chat
router.post('/helpchatbot/start', chatbotController.startChat);

// Continue chat (send answer, get next question)
router.post('/helpchatbot/continue', chatbotController.continueChat);

// Get all chatbot data
router.get('/getallchats',verifyToken(['superadmin', 'admin']), chatbotController.getAllChats);

module.exports = router;
