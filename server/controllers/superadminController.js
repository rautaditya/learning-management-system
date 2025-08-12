

const Course = require('../models/Course');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const bcrypt = require('bcryptjs');
const Video = require('../models/video');
const StudyMaterial = require('../models/StudyMaterial');

/**
 * @desc    Add a new Admin
 * @route   POST /superadmin/add-admin
 */
exports.addAdmin = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
      confirmPassword,
      role,
      status,
      gender,
      dob,
      address,
      joiningDate
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let profileImage = '';

    if (req.file) {
      profileImage = `/uploads/${req.file.filename}`;
    }

    const newUser = new User({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role,
      status,
      gender,
      dob,
      address,
      joiningDate,
      profileImage
    });

    await newUser.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error('Add Admin Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get list of all admins
 * @route   GET /superadmin/getalladmins
 */
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.status(200).json(admins);
  } catch (error) {
    console.error('Get All Admins Error:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
};

/**
 * @desc    Update Admin
 * @route   PUT /superadmin/update-admin/:id
 */
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      mobile,
      role,
      status,
      gender,
      dob,
      address,
      joiningDate,
      password,
      confirmPassword
    } = req.body;

    const admin = await User.findById(id);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (email && email !== admin.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
      admin.password = await bcrypt.hash(password, 10);
    }

    admin.fullName = fullName || admin.fullName;
    admin.email = email || admin.email;
    admin.mobile = mobile || admin.mobile;
    admin.role = role || admin.role;
    admin.status = status || admin.status;
    admin.gender = gender || admin.gender;
    admin.dob = dob || admin.dob;
    admin.address = address || admin.address;
    admin.joiningDate = joiningDate || admin.joiningDate;

    if (req.file) {
      admin.profileImage = `/uploads/${req.file.filename}`;
    }

    await admin.save();

    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    console.error('Update Admin Error:', error);
    res.status(500).json({ message: 'Server error while updating admin' });
  }
};


/**
 * @desc    Delete Admin
 * @route   DELETE /superadmin/delete-admin/:id
 */
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findById(id);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete Admin Error:', error);
    res.status(500).json({ message: 'Server error while deleting admin' });
  }
};

/**
 * @desc    Get all pending courses
 * @route   GET /superadmin/courses/pending
 */
exports.getPendingCourses = async (req, res) => {
  try {
    const pendingCourses = await Course.find({ approved: false })
      .populate('createdBy', 'fullName email role');

    res.status(200).json(pendingCourses);
  } catch (error) {
    console.error('Get Pending Courses Error:', error);
    res.status(500).json({ message: 'Error fetching pending courses' });
  }
};

/**
 * @desc    Approve a course
 * @route   PUT /courses/:id/approve
 */
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('videos').populate('approvedBy').populate('createdBy');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

// Get a single course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('videos').populate('approvedBy').populate('createdBy');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course', error });
    }
};

// Update a course by ID
exports.updateCourseController = async (req, res) => {
  const { id } = req.params;
  const { title, category, priceType, instructor, language, approved } = req.body;
  const courseImage = req.file ? req.file.path : null;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.title = title;
    course.category = category;
    course.priceType = priceType;
    course.instructor = instructor;
    course.language = language;
    if (courseImage) course.courseImage = courseImage;

    const userId = req.user && req.user._id ? req.user._id : null;
    console.log("Approver userId:", userId);

    if (approved === 'true' || approved === true) {
      course.approved = true;
      course.approvedBy = userId;
      course.approvedAt = new Date();
    } else if (approved === 'false' || approved === false) {
      course.approved = false;
      course.approvedBy = userId;
      course.approvedAt = new Date();
    } else {
      course.approved = null;
      course.approvedBy = null;
      course.approvedAt = null;
    }

    await course.save();
    res.status(200).json(course);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error while updating course.' });
  }
};





// Delete a course by ID
exports.deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error });
    }
};

// controller (superadmin)
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('videos') // Populate all video details
      .populate('createdBy', 'name')
      .populate('approvedBy', 'name');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAssignment = async (req, res) => {
    try {
        // console.log('File:', req.file);
        // console.log('Body:', req.body);

        const { course, title, description, dueDate } = req.body;

        const assignment = await Assignment.create({
            course,
            title,
            description,
            dueDate,
            fileUrl: req.file ? `/uploads/others/${req.file.filename}` : null,
            createdBy: req.user.id // Assuming user is attached by middleware
        });

        res.status(201).json(assignment);
    } catch (err) {
        console.error('Assignment error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getApprovedCourses = async (req, res) => {
    try {
        const approvedCourses = await Course.find({ approved: true })
            .populate('createdBy', 'name email') // populate createdBy with name and email
            .populate('approvedBy', 'name email') // populate approvedBy with name and email
            .populate('videos'); // optional: if you want to fetch video details

        res.status(200).json({
            success: true,
            message: 'Approved courses fetched successfully.',
            data: approvedCourses
        });
    } catch (error) {
        console.error('Error fetching approved courses:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching approved courses.',
            error: error.message
        });
    }
};


// GET: Fetch all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const adminId = req.user.id; // assuming your verifyToken middleware sets this
    const assignments = await Assignment.find()
      .populate('course')
      .sort({ createdAt: -1 });

    res.status(200).json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT: Update an assignment
exports.updateAssignment = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
    };

    if (req.body.dueDate) {
      updateData.dueDate = new Date(req.body.dueDate);
    }

    if (req.file) {
      updateData.fileUrl = `/uploads/others/${req.file.filename}`;
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Failed to update assignment' });
  }
};



// DELETE: Delete an assignment
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

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password -otp -otpExpires');
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};
// Update student info
exports.updateStudent = async (req, res) => {
  const studentId = req.params.id;
  const { status } = req.body;

  try {
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ error: 'Student not found or not a student' });
    }

    if (status) {
      student.status = status;
    }

    await student.save();

    const updatedStudent = await User.findById(studentId).select('-password -otp -otpExpires');
    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
};
exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    // Find the user by ID and ensure the role is 'student'
    const student = await User.findOne({ _id: studentId, role: 'student' });

    if (!student) {
      return res.status(404).json({ error: 'Student not found or not a student' });
    }

    // Delete the student
    await User.findByIdAndDelete(studentId);

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};




//logic to add video
exports.addVideo = async (req, res) => {
  try {
    const { course, title, description, duration } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const newVideo = await Video.create({
      course,
      title,
      description,
      duration,
      videoPath: `/uploads/videos/${req.file.filename}` // ✅ Include this!
    });

    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (err) {
    console.error('Error uploading video:', err);
    res.status(500).json({ message: 'Server error while uploading video' });
  }
};

//logic to get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('course'); // populate course title
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch videos' });
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


exports.updateVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const updateFields = req.body;

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updateFields, {
      new: true,
    });

    if (!updatedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ message: 'Video updated successfully', video: updatedVideo });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
exports.addStudyMaterial = async (req, res) => {
  try {
    const { title, courseId } = req.body;
    const file = req.file;

    const newMaterial = new StudyMaterial({
      title,
      course: courseId,
      filePath: file.path,
      uploadedBy: req.user._id
    });

    await newMaterial.save();
    res.status(201).json({ message: 'Study material uploaded by Superadmin', material: newMaterial });
  } catch (err) {
    console.error('Superadmin Study Material Upload Error:', err);
    res.status(500).json({ message: 'Failed to upload study material' });
  }
};

exports.updateSuperadminProfile = async (req, res) => {
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