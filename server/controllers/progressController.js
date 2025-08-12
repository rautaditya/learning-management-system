// controllers/progressController.js
const CourseProgress = require('../models/CourseProgress');
const Course = require('../models/Course');
const Exam = require('../models/Exam');
const Student = require('../models/User');
const Certificate = require('../models/Certificate');
const sendCertificateEmail = require('../utils/sendCertificateEmail');

const calculateWeightedProgress = (completedVideosCount, totalVideosCount, completedExamsCount, totalExamsCount) => {
  const VIDEO_WEIGHT = 0.80;
  const EXAM_WEIGHT = 0.20;

  const actualVideoWeight = totalVideosCount > 0 ? VIDEO_WEIGHT : 0;
  const actualExamWeight = totalExamsCount > 0 ? EXAM_WEIGHT : 0;

  const videoContribution = totalVideosCount > 0
    ? (completedVideosCount / totalVideosCount) * actualVideoWeight
    : 0;

  const examContribution = totalExamsCount > 0
    ? (completedExamsCount / totalExamsCount) * actualExamWeight
    : 0;

  const totalPossibleWeight = actualVideoWeight + actualExamWeight;

  let overallProgress = 0;
  if (totalPossibleWeight > 0) {
    overallProgress = ((videoContribution + examContribution) / totalPossibleWeight) * 100;
  }

  return Math.round(overallProgress);
};

const handleCertificateGeneration = async (studentId, courseId) => {
  try {
    console.log('🔔 handleCertificateGeneration CALLED');

    // Check if certificate already exists
    const existing = await Certificate.findOne({ student: studentId, course: courseId });
    if (existing) {
      console.log('❌ Certificate already exists.');
      return;
    }

    // Get student and course
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
  console.error('❌ Student or Course not found.');
  return;
}

if (!student.email || student.email.trim() === "") {
  console.error('❌ Student email is missing or empty. Cannot send certificate.');
  return;
}


    // Create certificate
    const certificate = await Certificate.create({
      student: studentId,
      course: courseId,
      issuedDate: new Date(),
    });

    // Send email with certificate
    await sendCertificateEmail({
      to: student.email,
      name: student.fullName,
      courseName: course.title,
      issuedDate: certificate.issuedDate,
    });

    // Update CourseProgress
    const progress = await CourseProgress.findOne({ student: studentId, course: courseId });
    if (progress) {
      progress.certificateIssued = true;
      await progress.save();
      console.log('✅ certificateIssued updated in DB');
    }

    console.log('🏁 Certificate generated and email sent successfully.');

  } catch (error) {
    console.error('❌ Error generating certificate:', error);
  }
};


exports.trackVideoProgress = async (req, res) => {
  try {
    const { courseId, videoId } = req.body;
    const studentId = req.user._id;

    if (!courseId || !videoId) {
      return res.status(400).json({ message: 'Missing courseId or videoId' });
    }

    let progress = await CourseProgress.findOne({ student: studentId, course: courseId });

    if (!progress) {
      progress = new CourseProgress({
        student: studentId,
        course: courseId,
        completedVideos: [videoId],
        completedExams: [],
      });
    } else {
      if (!progress.completedVideos.includes(videoId)) {
        progress.completedVideos.push(videoId);
      }
    }

    const course = await Course.findById(courseId);
    const totalVideos = course?.videos?.length || 0;
    const totalExams = course?.exams?.length || 0;

    progress.progress = calculateWeightedProgress(
      progress.completedVideos.length,
      totalVideos,
      progress.completedExams.length,
      totalExams
    );

    await progress.save();

    if (progress.progress >= 100 && !progress.certificateIssued) {
      await handleCertificateGeneration(studentId, courseId);
    }

    return res.status(200).json({
      message: 'Video marked as completed',
      progress: progress.progress,
      completedVideos: progress.completedVideos.map(id => id.toString()),
      completedExams: progress.completedExams.map(id => id.toString()),
    });
  } catch (err) {
    console.error('❌ trackVideoProgress error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.trackExamCompletion = async (req, res) => {
  try {
    const { courseId, examId } = req.body;
    const studentId = req.user._id;

    if (!courseId || !examId) {
      return res.status(400).json({ message: 'Missing courseId or examId' });
    }

    let progress = await CourseProgress.findOne({ student: studentId, course: courseId });

    if (!progress) {
      progress = new CourseProgress({
        student: studentId,
        course: courseId,
        completedVideos: [],
        completedExams: [examId],
      });
    } else {
      if (!progress.completedExams.includes(examId)) {
        progress.completedExams.push(examId);
      }
    }

    const course = await Course.findById(courseId);
    const totalVideos = course?.videos?.length || 0;
    const totalExams = course?.exams?.length || 0;

    progress.progress = calculateWeightedProgress(
      progress.completedVideos.length,
      totalVideos,
      progress.completedExams.length,
      totalExams
    );

    await progress.save();

    if (progress.progress >= 100 && !progress.certificateIssued) {
      await handleCertificateGeneration(studentId, courseId);
    }

    return res.status(200).json({
      message: 'Exam marked as completed',
      progress: progress.progress,
      completedVideos: progress.completedVideos.map(id => id.toString()),
      completedExams: progress.completedExams.map(id => id.toString()),
    });
  } catch (err) {
    console.error('❌ trackExamCompletion error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCourseProgress = async (req, res) => {
  const courseId = req.params.courseId;
  const studentId = req.user._id;

  try {
    const progress = await CourseProgress.findOne({ student: studentId, course: courseId });
    const course = await Course.findById(courseId);

    const totalVideos = course?.videos?.length || 0;
    const totalExams = course?.exams?.length || 0;

    if (!progress) {
      const initialProgress = calculateWeightedProgress(0, totalVideos, 0, totalExams);
      return res.json({ completedVideos: [], completedExams: [], progress: initialProgress });
    }

    const currentProgress = calculateWeightedProgress(
      progress.completedVideos.length,
      totalVideos,
      progress.completedExams.length,
      totalExams
    );

    res.json({
      completedVideos: progress.completedVideos.map(v => v.toString()),
      completedExams: progress.completedExams.map(v => v.toString()),
      progress: currentProgress,
    });
  } catch (error) {
    console.error('❌ Error fetching course progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
