const StudyMaterial = require('../models/StudyMaterial');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Add Study Material
exports.addStudyMaterial = async (req, res) => {
  try {
    const { title, courseId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const material = new StudyMaterial({
      title,
      course: courseId,
      filePath: file.path,
      uploadedBy: req.user._id
    });

    await material.save();
    res.status(201).json({ message: 'Material added', material });
  } catch (err) {
    console.error('Add Material Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const fs = require('fs');
const path = require('path');
// const StudyMaterial = require('../models/StudyMaterial');

exports.updateStudyMaterial = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;

    const material = await StudyMaterial.findById(id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    // Only allow editing if user is owner or superadmin
    if (
      req.user.role === 'admin' &&
      material.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'You can only update your materials' });
    }

    material.title = title || material.title;

    if (req.file) {
      material.filePath = req.file.path;
    }

    material.updatedBy = req.user._id;
    await material.save();

    res.status(200).json({ message: 'Study material updated', material });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update study material' });
  }
};



// Delete Study Material
exports.deleteStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await StudyMaterial.findById(id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    // Authorization check
    if (
      req.user.role === 'admin' &&
      material.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this material' });
    }

    material.deletedBy = req.user._id;
    material.deletedAt = new Date();

    await material.save(); // Soft delete
    res.status(200).json({ message: 'Material marked as deleted' });

    // Optional hard delete
    // await StudyMaterial.findByIdAndDelete(id);
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Study Materials by Admin
exports.getStudyMaterialsByAdmin = async (req, res) => {
  try {
    const materials = await StudyMaterial.find({
      uploadedBy: req.user._id,
      deletedAt: { $exists: false }
    })
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(materials);
  } catch (err) {
    console.error('Fetch admin materials error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Study Materials (Superadmin)
exports.getAllStudyMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find({ deletedAt: { $exists: false } })
      .populate('course', 'title')
      .populate('uploadedBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json(materials);
  } catch (err) {
    console.error('Fetch all materials error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getStudentStudyMaterials = async (req, res) => {
  try {
    // console.log("User Info:", req.user);
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ student: studentId }).select('courseId');
    const enrolledCourseIds = enrollments.map(e => e.courseId);

    console.log("Enrolled Courses:", enrolledCourseIds);

    const materials = await StudyMaterial.find({ course: { $in: enrolledCourseIds } })
      .populate('course', 'title');

    // console.log("Fetched Materials:", materials);

    res.status(200).json(materials);
  } catch (error) {
    console.error('Error fetching student materials:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
