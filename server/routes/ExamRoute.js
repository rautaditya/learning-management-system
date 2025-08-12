const express = require("express");
const router = express.Router();
const ExamController = require("../controllers/ExamController");
const studentProtect = require("../middleware/studentProtect");

// ROUTES
router.post('/submit', studentProtect, ExamController.submitExam); // ✅ Correct order
router.get('/:examId', ExamController.getExamById);
router.get('/check-submission/:examId', studentProtect, ExamController.checkExamSubmission);

module.exports = router;
