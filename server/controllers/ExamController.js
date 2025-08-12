const Exam = require('../models/Exam');
const StudentExamSubmission = require('../models/StudentExamSubmission');

exports.getExamById = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId).populate('course', 'title');

    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    res.status(200).json({ success: true, exam });
  } catch (err) {
    console.error('Error fetching exam by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitExam = async (req, res) => {
  try {
    const studentId = req.user._id; // ✅ comes from studentProtect
    const { examId, answers } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let totalMarks = 0;
    const evaluatedAnswers = answers.map((ans) => {
      const question = exam.questions[ans.questionIndex];
      const isCorrect = question.correctOptionIndex === ans.selectedOptionIndex;
      const marks = isCorrect ? question.marks : 0;
      totalMarks += marks;

      return {
        questionIndex: ans.questionIndex,
        selectedOptionIndex: ans.selectedOptionIndex,
        isCorrect,
        marksObtained: marks
      };
    });

    const submission = new StudentExamSubmission({
      exam: examId,
      student: studentId,
      answers: evaluatedAnswers,
      totalMarksObtained: totalMarks
    });

    await submission.save();
    res.status(201).json({ message: 'Exam submitted', submission });

  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.checkExamSubmission = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { examId } = req.params;

    const existingSubmission = await StudentExamSubmission.findOne({
      exam: examId,
      student: studentId
    });

    res.status(200).json({ submitted: !!existingSubmission });
  } catch (err) {
    console.error("Error checking submission:", err);
    res.status(500).json({ message: "Server error" });
  }
};
