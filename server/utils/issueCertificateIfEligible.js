const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const Student = require('../models/User');
const { sendCertificateEmail } = require('../utils/emailSender');

exports.issueCertificateIfEligible = async (studentId, courseId) => {
  try {
    const progress = await CourseProgress.findOne({ student: studentId, course: courseId });
    if (!progress) return;

    if (progress.progress === 100 && !progress.certificateIssued) {
      // Mark certificate as issued
      progress.certificateIssued = true;
      await progress.save();

      // Fetch student and course
      const student = await Student.findById(studentId);
      const course = await Course.findById(courseId);

      if (student && course) {
        // Issue certificate in DB
        await Certificate.create({
          student: student._id,
          course: course._id,
          templateName: 'Course Completion'
        });

        // Send email
        await sendCertificateEmail(student.email, student.fullName, course.title);
        console.log(`🎓 Certificate issued and email sent to ${student.email}`);
      }
    }
  } catch (err) {
    console.error("❌ Error issuing certificate:", err.message);
  }
};
