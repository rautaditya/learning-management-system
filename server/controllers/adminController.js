// POST /courses (admin adds course)
const uploads = require('../middleware/upload');
const CourseProgress = require('../models/CourseProgress');

  const Course = require('../models/Course');
  const Assignment = require('../models/Assignment');
const Video = require('../models/Video');

const Exam = require('../models/Exam');

const User = require('../models/User'); 
const Enrollment = require('../models/Enrollment'); // ✅ Add this line
// Optional: If you want to validate createdBy
const StudyMaterial = require('../models/StudyMaterial');

const mongoose = require('mongoose');

// const Question = require('../models/Exam/Question');



// POST /courses - Admin adds a course
exports.addCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      courseImage,
      priceType,
      price,
      instructor,
      duration,
      level,
      syllabus,
      prerequisites,
      language,
      certification
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Construct course data
    const courseData = {
      title,
      description,
      category,
      courseImage,
      priceType,
      price: priceType === 'Paid' ? price : 0, // Free courses have price 0
      instructor,
      duration,
      level,
      syllabus,
      prerequisites,
      language,
      certification,
      createdBy: req.user.id, // From JWT auth middleware
    };

    // Handle image upload
    if (req.file) {
      courseData.courseImage = req.file.path; // ✅ Match schema
    }
    

    // Save to DB
    const course = new Course(courseData);
    await course.save();

    res.status(201).json({ message: 'Course added successfully', course });
  } catch (error) {
    console.error('Add Course Error:', error);
    res.status(500).json({ message: 'Error adding course' });
  }
};

// GET /courses/admin - Admin sees their own created courses
// exports.getAdminCourses = async (req, res) => {
//   try {
//     const adminId = req.user.id;

//     const courses = await Course.find({ createdBy: adminId });

//     res.status(200).json(courses);
//   } catch (error) {
//     console.error('Get Admin Courses Error:', error);
//     res.status(500).json({ message: 'Error fetching courses' });
//   }
// };

exports.getAdminCourses = async (req, res) => {
  try {
    const adminId = req.user.id;
    const courses = await Course.find({ createdBy: adminId });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Get Admin Courses Error:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};


// Update a course (Admin updates course)
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id; // Get the course ID from the URL parameters
    const {
      title,
      description,
      category,
      priceType,
      price,
      instructor,
      duration,
      level,
      syllabus,
      prerequisites,
      language,
      certification
    } = req.body;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update course fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.priceType = priceType || course.priceType;
    course.price = priceType === 'Paid' ? price : 0; // Free courses have price 0
    course.instructor = instructor || course.instructor;
    course.duration = duration || course.duration;
    course.level = level || course.level;
    course.syllabus = syllabus || course.syllabus;
    course.prerequisites = prerequisites || course.prerequisites;
    course.language = language || course.language;
    course.certification = certification || course.certification;

    // If a new image is uploaded, replace the old image
    if (req.file) {
      course.courseImage = req.file.path; // Update the image path
    }

    // Save the updated course
    await course.save();

    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Update Course Error:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
};

// Delete a course (Admin deletes course)
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id; // Get the course ID from the URL parameters

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Optionally delete the course image (if needed, e.g., using fs.unlink to remove image from the server)
    // If you want to delete the file physically, you could use `fs` or another method to remove the image file.

    // Delete the course
    await Course.findByIdAndDelete(courseId);
    // await course.remove();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete Course Error:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
  
};


exports.createExam = async (req, res) => {
  try {
    const {
      course,
      title,
      description,
      totalMarks,
      questions,
      createdBy,
      examDueDate // ✅ receive it
    } = req.body;

    if (!course || !title || !totalMarks || !questions || !createdBy || !examDueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const foundCourse = await Course.findById(course);
    if (!foundCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const foundUser = await User.findById(createdBy);
    if (!foundUser) {
      return res.status(404).json({ message: 'User (createdBy) not found' });
    }

    const newExam = new Exam({
      course,
      title,
      description,
      totalMarks,
      questions,
      createdBy,
      examDueDate // ✅ store it
    });

    const savedExam = await newExam.save();

    res.status(201).json({
      message: 'Exam created successfully',
      exam: savedExam
    });

  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


exports.getExam = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('course', 'title') // if you want course title
      .populate('createdBy', 'fullName'); // 👈 populate createdBy with only name

    res.status(200).json({ success: true, exams });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Exam by ID
// controllers/examController.js

exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, totalMarks, questions } = req.body;

    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      { title, description, totalMarks, questions },
      { new: true }
    );

    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json({ message: 'Exam updated', exam: updatedExam });
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Delete Exam by ID
exports.deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findByIdAndDelete(examId);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json({
      message: 'Exam deleted successfully',
      examId: exam._id
    });

  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};





//to get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Error fetching admin profile' });
  }
};


exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'fullName email')
      .populate('courseId', 'title');

    res.status(200).json(enrollments);
  } catch (err) {
    console.error('❌ Enrollment Fetch Error:', err); // <== log actual issue
    res.status(500).json({ message: 'Failed to fetch enrollments' });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware (or pass manually in req.body._id)

    const {
      fullName,
      username,
      email,
      mobile,
      role,
      status,
      gender,
      dob,
      address,
    } = req.body;

    const updateFields = {
      fullName,
      username,
      email,
      mobile,
      role,
      status,
      gender,
      dob,
      address,
    };

    // Image updates
    if (req.files?.profileImage) {
      updateFields.profileImage = `/uploads/images/${req.files.profileImage[0].filename}`;
    }
    if (req.files?.backgroundImage) {
      updateFields.backgroundImage = `/uploads/images/${req.files.backgroundImage[0].filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Update profile failed:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// controllers/progressController.js
exports.getCourseCompletionReport = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Step 1: Get total students in this course
    const totalEnrolled = await CourseProgress.countDocuments({ course: courseId });

    // Step 2: Get students with 100% progress
    const completedStudents = await CourseProgress.countDocuments({ 
      course: courseId, 
      progress: 100 
    });

    // Step 3: Calculate percentage
    const completionPercentage = totalEnrolled > 0 
      ? (completedStudents / totalEnrolled) * 100 
      : 0;

    res.json({
      courseId,
      totalEnrolled,
      completedStudents,
      completionPercentage
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// In your examController.js
exports.getExamCompletionReport = async (req, res) => {
  try {
    const { examId } = req.params;

    // 1. Verify exam exists
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // 2. Get completion stats - CRITICAL FIX HERE
    const [completedCount, totalEnrolled] = await Promise.all([
      CourseProgress.countDocuments({
        completedExams: { $elemMatch: { $eq: examId } }, // Proper array matching
        course: exam.course
      }),
      CourseProgress.countDocuments({ course: exam.course })
    ]);

    // 3. Calculate percentage
    const completionPercentage = totalEnrolled > 0 
      ? (completedCount / totalEnrolled) * 100 
      : 0;

    res.json({
      examId,
      completedStudents: completedCount,
      totalEnrolled,
      completionPercentage: parseFloat(completionPercentage.toFixed(1))
    });

  } catch (error) {
    console.error('Exam completion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// In your assignment controller
// Get all submissions for a specific assignment
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId)
      .populate({
        path: 'submissions.student',
        select: 'fullName email' // Removed profileImage
      })
      .populate('course', 'title'); // Populate course title

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({
      data: {
        submissions: assignment.submissions.map(sub => ({
          _id: sub._id,
          studentId: sub.student._id,
          studentName: sub.student.fullName,
          studentEmail: sub.student.email,
          fileUrl: sub.fileUrl,
          submittedAt: sub.submittedAt,
          status: sub.status.replace(',', ''), // Clean up status
          courseTitle: assignment.course?.title
        }))
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};