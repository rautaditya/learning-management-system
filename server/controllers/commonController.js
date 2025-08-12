// const ContactMessage = require('../models/ContactMessage');
// const Video = require('../models/Video');
// const Assignment = require('../models/Assignment');
// const Course = require('../models/Course');
// const User = require('../models/User');
// const Exam = require('../models/Exam');
// const path = require('path');
// const fs = require('fs');
// const StudyMaterial = require('../models/StudyMaterial');
// const CourseProgress= require('../models/CourseProgress');
// const course= require('../models/Course');
// exports.submitContactForm = async (req, res) => {
//   try {
//     const { name, email, department, subject, message } = req.body;

//     const newMessage = new ContactMessage({
//       name,
//       email,
//       department,
//       subject,
//       message
//     });

//     await newMessage.save();
//     res.status(201).json({ message: 'Contact form submitted successfully' });
//   } catch (error) {
//     console.error('Error submitting contact form:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.getAllMessages = async (req, res) => {
//   try {
//     const messages = await ContactMessage.find().sort({ submittedAt: -1 });
//     res.status(200).json(messages);
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // ==================== Assignment ====================

// exports.createAssignment = async (req, res) => {
//   try {
//     const { course, title, description, dueDate } = req.body;

//     const assignment = await Assignment.create({
//       course,
//       title,
//       description,
//       dueDate,
//       fileUrl: req.file ? `/uploads/others/${req.file.filename}` : null,
//       createdBy: req.user.id
//     });

//     res.status(201).json(assignment);
//   } catch (err) {
//     console.error('Assignment error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.getAllAssignments = async (req, res) => {
//   try {
//     const adminId = req.user.id;
//     const assignments = await Assignment.find({ createdBy: adminId })
//       .populate('course')
//       .sort({ createdAt: -1 });

//     res.status(200).json(assignments);
//   } catch (err) {
//     console.error('Error fetching assignments:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.updateAssignment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, dueDate } = req.body;

//     const updateData = { title, description, dueDate };

//     if (req.file) {
//       updateData.fileUrl = `/uploads/others/${req.file.filename}`;
//     }

//     const updatedAssignment = await Assignment.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!updatedAssignment) {
//       return res.status(404).json({ message: 'Assignment not found' });
//     }

//     res.status(200).json(updatedAssignment);
//   } catch (err) {
//     console.error('Update error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.deleteAssignment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Assignment.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ message: 'Assignment not found' });

//     res.status(200).json({ message: 'Assignment deleted' });
//   } catch (err) {
//     console.error('Delete error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ==================== Videos ====================

// exports.addVideoToCourse = async (req, res) => {
//   try {
//     const { course, title, description, duration } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: 'No video file uploaded' });
//     }

//     const newVideo = await Video.create({
//       course,
//       title,
//       description,
//       duration,
//       videoPath: `uploads/videos/${req.file.filename}`
//     });

//     // ✅ Push video into the course.videos array
//     await Course.findByIdAndUpdate(course, {
//       $push: { videos: newVideo._id }
//     });

//     res.status(201).json({ message: 'Video uploaded and added to course successfully', video: newVideo });
//   } catch (err) {
//     console.error('Error uploading video:', err);
//     res.status(500).json({ message: 'Server error while uploading video' });
//   }
// };

// exports.getAllVideos = async (req, res) => {
//   try {
//     const videos = await Video.find().populate('course').sort({ createdAt: -1 });
//     res.status(200).json(videos);
//   } catch (err) {
//     console.error('Error fetching videos:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.updateVideo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const video = await Video.findById(id);
//     if (!video) return res.status(404).json({ message: "Video not found" });

//     const { title, description, duration, course } = req.body;

//     if (req.file) {
//       const oldPath = path.join(__dirname, '../', video.videoPath);
//       if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

// video.videoPath = `uploads/videos/${req.file.filename}`;
//     }

//     video.title = title || video.title;
//     video.description = description || video.description;
//     video.duration = duration || video.duration;
//     video.course = course || video.course;

//     await video.save();
//     res.json({ message: "Video updated successfully", video });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to update video", error: err.message });
//   }
// };

// exports.deleteVideo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Video.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ message: 'Video not found' });

//     res.status(200).json({ message: 'Video deleted' });
//   } catch (err) {
//     console.error('Delete error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ==================== Students ====================

// exports.getAllStudents = async (req, res) => {
//   try {
//     const students = await User.find({ role: 'student' }).select('-password -otp -otpExpires');
//     res.status(200).json(students);
//   } catch (err) {
//     console.error('Error fetching students:', err);
//     res.status(500).json({ error: 'Failed to fetch students' });
//   }
// };

// exports.updateStudent = async (req, res) => {
//   const studentId = req.params.id;
//   const { status } = req.body;

//   try {
//     const student = await User.findOne({ _id: studentId, role: 'student' });
//     if (!student) {
//       return res.status(404).json({ error: 'Student not found or not a student' });
//     }

//     if (status) {
//       student.status = status;
//     }

//     await student.save();

//     const updatedStudent = await User.findById(studentId).select('-password -otp -otpExpires');
//     res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
//   } catch (err) {
//     console.error('Error updating student:', err);
//     res.status(500).json({ error: 'Failed to update student' });
//   }
// };

// exports.deleteStudent = async (req, res) => {
//   const studentId = req.params.id;

//   try {
//     const student = await User.findOne({ _id: studentId, role: 'student' });

//     if (!student) {
//       return res.status(404).json({ error: 'Student not found or not a student' });
//     }

//     await User.findByIdAndDelete(studentId);

//     res.status(200).json({ message: 'Student deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting student:', err);
//     res.status(500).json({ error: 'Failed to delete student' });
//   }
// };

// const Enrollment = require('../models/Enrollment'); // adjust path if needed

// exports.getAllEnrollments = async (req, res) => {
//   try {
//     const enrollments = await Enrollment.find()
//       .populate('student', 'fullName email')    // Only include student fullName & email
//       .populate('courseId', 'title')            // Only include course title
//       .sort({ createdAt: -1 });                 // Latest first (optional)

//     res.status(200).json(enrollments);
//   } catch (error) {
//     console.error('Error fetching enrollments:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };


// exports.getDashboardStats = async (req, res) => {
//   try {
//     const [
//       totalStudents,
//       totalAdmins,
//       totalCourses,
//       totalVideos,
//       totalAssignments,
//       totalMessages,
//       totalExams
//     ] = await Promise.all([
//       User.countDocuments({ role: 'student' }),
//       User.countDocuments({ role: 'admin' }), // Count admins
//       Course.countDocuments(),
//       Video.countDocuments(),
//       Assignment.countDocuments(),
//       ContactMessage.countDocuments(),
//       Exam.countDocuments()
//     ]);

//     res.status(200).json({
//       success: true,
//       message: "Dashboard stats fetched successfully",
//       data: {
//         totalStudents,
//         totalAdmins,
//         totalCourses,
//         totalVideos,
//         totalAssignments,
//         totalMessages,
//         totalExams
//       }
//     });
//   } catch (err) {
//     console.error("Error fetching dashboard stats:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// exports.getCourseEnrollmentsWithProgress = async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     const enrollments = await Enrollment.find({ courseId })
//       .populate('student', 'name email');

//     const progressRecords = await CourseProgress.find({ course: courseId });

//     const progressMap = {};
//     progressRecords.forEach((record) => {
//       progressMap[record.student.toString()] = record.progress;
//     });

//     const students = enrollments.map((enroll) => ({
//       id: enroll.student._id,
//       name: enroll.student.name,
//       email: enroll.student.email,
//       enrolledAt: enroll.enrolledAt,
//       status: enroll.status,
//       paymentInfo: enroll.paymentInfo,
//       progress: progressMap[enroll.student._id.toString()] || 0
//     }));

//     res.status(200).json({ students });
//   } catch (err) {
//     console.error('Error fetching course-wise student list:', err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // GET /api/common/progress/:courseId/:studentId
// exports.getStudentCourseProgress = async (req, res) => {
//   try {
//     const { courseId, studentId } = req.params;

//     const progress = await CourseProgress.findOne({ course: courseId, student: studentId })
//       .populate('completedVideos', 'title duration') // Optional
//       .populate('completedExams', 'title totalMarks'); // Optional

//     if (!progress) {
//       return res.status(404).json({ message: 'No progress found' });
//     }

//     res.status(200).json({
//       progress: progress.progress,
//       completedVideos: progress.completedVideos,
//       completedExams: progress.completedExams,
//       updatedAt: progress.updatedAt,
//     });
//   } catch (err) {
//     console.error("Error fetching student progress:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// 📁 controllers/commonController.js (final combined file)
const mongoose = require('mongoose');

const ContactMessage = require('../models/ContactMessage');
const Video = require('../models/Video');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const User = require('../models/User');
const Exam = require('../models/Exam');
const path = require('path');
const fs = require('fs');
const StudyMaterial = require('../models/StudyMaterial');
const CourseProgress = require('../models/CourseProgress');
const Enrollment = require('../models/Enrollment');
const StudentExamSubmission = require('../models/StudentExamSubmission');
const CourseCategory = require('../models/CourseCategory');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, department, subject, message } = req.body;
    const newMessage = new ContactMessage({ name, email, department, subject, message });
    await newMessage.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ submittedAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// === Assignment ===

exports.createAssignment = async (req, res) => {
  try {
    const { course, title, description, dueDate } = req.body;
    const assignment = await Assignment.create({
      course,
      title,
      description,
      dueDate,
      fileUrl: req.file ? `/uploads/others/${req.file.filename}` : null,
      createdBy: req.user.id
    });
    res.status(201).json(assignment);
  } catch (err) {
    console.error('Assignment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const adminId = req.user.id;
    const assignments = await Assignment.find({ createdBy: adminId })
      .populate('course')
      .sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const updateData = { title, description, dueDate };
    if (req.file) updateData.fileUrl = `/uploads/others/${req.file.filename}`;
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedAssignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json(updatedAssignment);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Assignment.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json({ message: 'Assignment deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// === Videos ===

exports.addVideoToCourse = async (req, res) => {
  try {
    const { course, title, description, duration } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No video file uploaded' });
    const newVideo = await Video.create({
      course,
      title,
      description,
      duration,
      videoPath: `uploads/videos/${req.file.filename}`
    });
    await Course.findByIdAndUpdate(course, { $push: { videos: newVideo._id } });
    res.status(201).json({ message: 'Video uploaded and added to course successfully', video: newVideo });
  } catch (err) {
    console.error('Error uploading video:', err);
    res.status(500).json({ message: 'Server error while uploading video' });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('course').sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    const { title, description, duration, course } = req.body;
    if (req.file) {
      const oldPath = path.join(__dirname, '../', video.videoPath);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      video.videoPath = `uploads/videos/${req.file.filename}`;
    }
    video.title = title || video.title;
    video.description = description || video.description;
    video.duration = duration || video.duration;
    video.course = course || video.course;
    await video.save();
    res.json({ message: "Video updated successfully", video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update video", error: err.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Video not found' });
    res.status(200).json({ message: 'Video deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// === Student Management ===

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password -otp -otpExpires');
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { status } = req.body;
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) return res.status(404).json({ error: 'Student not found or not a student' });
    if (status) student.status = status;
    await student.save();
    const updatedStudent = await User.findById(studentId).select('-password -otp -otpExpires');
    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) return res.status(404).json({ error: 'Student not found or not a student' });
    await User.findByIdAndDelete(studentId);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

// === Enrollment & Dashboard ===

exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'fullName email')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalAdmins, totalCourses, totalVideos, totalAssignments, totalMessages, totalExams] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      Course.countDocuments(),
      Video.countDocuments(),
      Assignment.countDocuments(),
      ContactMessage.countDocuments(),
      Exam.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: { totalStudents, totalAdmins, totalCourses, totalVideos, totalAssignments, totalMessages, totalExams },
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// === Student Progress ===

exports.getCourseEnrollmentsWithProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');

    const progressRecords = await CourseProgress.find({ course: courseId });

    const progressMap = {};
    progressRecords.forEach((record) => {
      progressMap[record.student.toString()] = record.progress;
    });

    const students = enrollments.map((enroll) => ({
      id: enroll.student._id,
      name: enroll.student.name,
      email: enroll.student.email,
      enrolledAt: enroll.enrolledAt,
      status: enroll.status,
      paymentInfo: enroll.paymentInfo,
      progress: progressMap[enroll.student._id.toString()] || 0,
    }));

    res.status(200).json({ students });

  } catch (err) {
    console.error('Error fetching course-wise student list:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getStudentCourseProgress = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    const progress = await CourseProgress.findOne({ course: courseId, student: studentId })
      .populate('completedVideos', 'title duration')
      .populate('completedExams', 'title totalMarks');

    if (!progress) return res.status(404).json({ message: 'No progress found' });

    res.status(200).json({
      progress: progress.progress,
      completedVideos: progress.completedVideos,
      completedExams: progress.completedExams,
      updatedAt: progress.updatedAt,
    });

  } catch (err) {
    console.error("Error fetching student progress:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFullStudentProgress = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Get course progress (videos)
    const courseProgress = await CourseProgress.findOne({
      student: studentId,
      course: courseId
    }).populate('completedVideos');

    const progress = courseProgress?.progress || 0;

    // Get all exams for the course
    const totalExams = await Exam.countDocuments({ course: courseId });

    // Get student exam submissions
    const examSubmissions = await StudentExamSubmission.find({
      student: studentId
    }).populate({
      path: 'exam',
      match: { course: courseId },
      select: 'title totalMarks'
    });

    const completedExams = examSubmissions
      .filter(sub => sub.exam !== null)
      .map(sub => ({
        _id: sub.exam._id,
        title: sub.exam.title,
        totalMarks: sub.exam.totalMarks,
        score: sub.totalMarksObtained
      }));

 const totalVideosInCourse = await Video.countDocuments({ course: courseId });

const totalExamScore = completedExams.reduce((sum, e) => sum + e.score, 0);

res.status(200).json({
  progress,
  totalVideos: totalVideosInCourse,
  completedVideos: courseProgress?.completedVideos || [],
  totalExams,
  completedExams,
  totalExamScore
});


  } catch (err) {
    console.error("Error in getFullStudentProgress", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().select('_id title');
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

exports.getCourseStudents = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    let enrollments;

    if (courseId === 'all') {
      enrollments = await Enrollment.find()
        .populate('student', 'fullName email')
        .populate('courseId', 'title'); // ✅ correct path
    } else {
      enrollments = await Enrollment.find({ courseId }) // ✅ filter key
        .populate('student', 'fullName email')
        .populate('courseId', 'title'); // ✅ correct path
    }

    const students = await Promise.all(
      enrollments.map(async (enroll) => {
        const progressDoc = await CourseProgress.findOne({
          student: enroll.student._id,
          course: enroll.courseId
        });

        return {
          id: enroll.student._id,
          name: enroll.student.fullName,
          email: enroll.student.email,
          courseId: enroll.courseId?._id?.toString() || '',
          courseTitle: enroll.courseId?.title || '',
          progress: progressDoc?.progress || 0,
        };
      })
    );

    res.status(200).json({ students });

  } catch (error) {
    console.error("Failed to get course students:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getAllCourseStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'fullName email')
      .populate('course', 'title');

    const students = enrollments.map((enroll) => ({
      id: enroll.student._id,
      name: enroll.student.fullName,
      email: enroll.student.email,
      courseId: enroll.course?._id?.toString() || '',
      courseTitle: enroll.course?.title || 'N/A',
      progress: enroll.progress || 0,
    }));

    res.status(200).json({ students });
  } catch (error) {
    console.error(" Failed to get all course students:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.createCourseCategory = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const existing = await CourseCategory.findOne({ title: title.trim() });
    if (existing) {
      return res.status(409).json({ error: 'Course category already exists' });
    }

    const category = new CourseCategory({ title: title.trim() });
    await category.save();

    return res.status(201).json(category);
  } catch (error) {
    console.error('Failed to add course category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getAllCourseCategories = async (req, res) => {
  try {
    const categories = await CourseCategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching course categories:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateCourseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const updatedCategory = await CourseCategory.findByIdAndUpdate(
      id,
      { title: title.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating course category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.deleteCourseCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await CourseCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting course category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
