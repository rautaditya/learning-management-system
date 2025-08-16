const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Exam = require('../models/Exam');
const Assignment = require('../models/Assignment');

const isProfileComplete = (user) => {
  const requiredFields = ["fullName", "username", "mobile", "gender", "dob", "address"];
  return requiredFields.every((field) => user[field] && user[field].toString().trim() !== "");
};

// GET /courses/student (student view)
exports.getApprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ approved: true });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching approved courses' });
  }
};

// GET /api/student/courses/:id
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy approvedBy'); // Optional: populate if you want extra user info

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



//get user profile 
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// controllers/studentController.js


const path = require('path');


exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Handle text fields
    const updates = req.body || {};
    
    // Optional: Log for debugging
    console.log('Request Body:', updates);
    console.log('Uploaded Files:', req.files);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle uploaded files
    if (req.files) {
      if (req.files.profileImage && req.files.profileImage[0]) {
        updates.profileImage = req.files.profileImage[0].path.replace(/\\/g, "/");
      }
      if (req.files.backgroundImage && req.files.backgroundImage[0]) {
        updates.backgroundImage = req.files.backgroundImage[0].path.replace(/\\/g, "/");
      }
    }

    // Update only the allowed fields
    const allowedFields = [
      'fullName','username', 'email', 'mobile', 'gender', 'dob',
      'address', 'profileImage', 'backgroundImage'
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    });

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





exports.getEnrollments=async (req, res) => {
  try {
const list = await Enrollment.find({ student: req.user._id }).select('courseId');
  res.json(list.map(e => e.courseId.toString()));
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getMyEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ student: studentId }).populate('courseId');

    const enrolledCourses = enrollments.map(enroll => enroll.courseId);

    res.json(enrolledCourses);
  } catch (err) {
    console.error("Error fetching enrolled courses:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getStudentCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.user._id; // From auth middleware

    const course = await Course.findById(courseId)
      .populate('videos')
      .populate('approvedBy', 'name email')
      .populate('createdBy', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const exams = await Exam.find({ course: courseId }).sort({ createdAt: -1 });

    const enrollment = await Enrollment.findOne({ course: courseId, student: studentId });

    res.status(200).json({
      ...course._doc,
      exams,
      progress: enrollment?.progress || 0
    });
    console.log(enrollment);
    console.log(course.videos);
  } catch (err) {
    console.error('Error in getStudentCourseById:', err);
    res.status(500).json({ message: 'Server error while fetching course details' });
  }
};
exports.getEnrolledExams = async (req, res) => {
  const { studentId } = req.params;

  try {
    // ✅ Step 1: Get enrolled course IDs for the student
    const enrollments = await Enrollment.find({ student: _id }).populate('courseId');

    if (!enrollments || enrollments.length === 0) {
      return res.status(200).json({ exams: [] });
    }

    const allExams = [];

    // ✅ Step 2: Get exams for each enrolled course
    for (const enrollment of enrollments) {
      const course = enrollment.courseId;

      const exams = await Exam.find({ course: course._id });

      exams.forEach(exam => {
        allExams.push({
          _id: exam._id,
          title: exam.title,
          description: exam.description,
          totalMarks: exam.totalMarks,
          course: {
            _id: course._id,
            title: course.title,
          },
        });
      });
    }

    res.status(200).json({ exams: allExams });
  } catch (err) {
    console.error('Error fetching enrolled exams:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





// controllers/studentController.js
// controllers/studentController.js
exports.getMyAssignments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const enrollments = await Enrollment.find({ student: studentId }).select('courseId');
    const courseIds = enrollments.map(e => e.courseId);

    console.log('Enrolled Course IDs:', courseIds);

    if (!courseIds.length) {
      return res.json({ assignments: [] });
    }

    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate('createdBy', 'fullName')
      .populate('course', 'title')
      .populate('video', 'title');

    console.log('Fetched Assignments:', assignments);

    res.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ msg: 'Failed to fetch assignments', error });
  }
};



exports.getMyEnrollments = async (req, res) => {
  try {
    // Assuming user is authenticated and req.user._id is set by auth middleware
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ student: userId })
      .populate('courseId', 'title price') // fetch only title & price from Course
      .populate('student', 'fullName email') // fetch student info if needed
      .sort({ enrolledAt: -1 });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    
    // Verify the authenticated student matches the submission student
    if (req.user._id.toString() !== studentId) {
      return res.status(403).json({ error: 'Unauthorized submission' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const submission = {
      student: studentId,
      fileUrl: req.file.path,
      submittedAt: new Date(),
      status: 'submitted'
    };

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { $push: { submissions: submission } },
      { new: true }
    ).populate('submissions.student', 'name email');

    res.status(201).json({
      success: true,
      assignment: updatedAssignment
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: error.message });
  }
};