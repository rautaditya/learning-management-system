const CertificateTemplate = require('../models/CertificateTemplate');
const Course = require('../models/Course');
const User = require('../models/User');
const CourseProgress = require('../models/CourseProgress');
const Certificate = require('../models/Certificate');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const sendCertificateEmail = require('../utils/sendCertificateEmail'); // ✅ import your util

// Helper to convert saved filepath to frontend-friendly URL
const filePathToUrl = (req, filePath) => {
  return `${req.protocol}://${req.get('host')}/${filePath.replace(/\\/g, '/')}`;
};

// Get list of courses
exports.getCourseList = async (req, res) => {
  try {
    const courses = await Course.find({}, '_id title').sort({ title: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCertificateTemplate = async (req, res) => {
  try {
    const imageUrl = filePathToUrl(req, req.file.path);

    const template = new CertificateTemplate({
      name: req.body.name,
      description: req.body.description,
      imageUrl,
      createdBy: req.user._id
    });

    await template.save();
    res.status(201).json(template);

  } catch (error) {
    console.error("createCertificateTemplate error:", error);
    res.status(500).send("Error creating certificate template");
  }
};

exports.getCertificateTemplates = async (req, res) => {
  try {
    const templates = await CertificateTemplate.find().populate('course', 'title');
    const updatedTemplates = templates.map(t => ({
      ...t.toObject(),
      imageUrl: filePathToUrl(req, t.imageUrl) // ✅ fixed argument order
    }));
    res.json(updatedTemplates);
  } catch (err) {
    console.error('getCertificateTemplates error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCertificateTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await CertificateTemplate.findById(id).populate('course', 'title');
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    console.error('getCertificateTemplateById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCertificateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, course } = req.body;
    const update = {};
    if (name) update.name = name;
    if (description) update.description = description;
    if (req.file) update.imageUrl = filePathToUrl(req, req.file.path);
    if (typeof course !== 'undefined') update.course = course || null;

    const updated = await CertificateTemplate.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Template not found' });

    if (typeof course !== 'undefined') {
      if (course) {
        await Course.findByIdAndUpdate(course, { template: updated._id });
      }
    }

    res.json({ message: 'Template updated', template: updated });
  } catch (err) {
    console.error('updateCertificateTemplate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCertificateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CertificateTemplate.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Template not found' });

    await Course.updateMany({ template: deleted._id }, { $set: { template: null } });

    res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error('deleteCertificateTemplate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.setCourseTemplate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { templateId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.template = templateId || null;
    await course.save();
    res.json({ message: 'Course template updated', course });
  } catch (err) {
    console.error('setCourseTemplate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCourseTemplate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate('template');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ template: course.template });
  } catch (err) {
    console.error('getCourseTemplate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getIssuedCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('student', 'name email _id') // ✅ use 'student' instead of 'user'
      .populate({
        path: 'course',
        select: 'title template _id',
        populate: {
          path: 'template',
          select: 'name imageUrl'
        }
      })
      .sort({ issuedDate: -1 })
      .lean();

    res.json(certificates);
  } catch (error) {
    console.error('Error in getIssuedCertificates:', error);
    res.status(500).json({ error: 'Failed to fetch issued certificates' });
  }
};

// controllers/certificateController.js// certificateController.js
// In certificateController.js
// controllers/certificateController.js
exports.viewCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.certificateId)
      .populate({ path: 'student', select: 'name email' })
      .populate({ path: 'course', select: 'title template' });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Construct file path
    const fileName = `${certificate.student.name}-${certificate.course.title}.pdf`;
    const filePath = path.join(__dirname, `../uploads/certificates/${fileName}`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Certificate file not found' });
    }

    // Send PDF so browser opens it
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error viewing certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.generateCertificateAndSendEmail = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    if (!courseId || !studentId) {
      return res.status(400).json({ error: 'CourseId or StudentId missing' });
    }

    // Find course & student
    const course = await Course.findById(courseId);
    const student = await User.findById(studentId);

    if (!course || !student) {
      return res.status(404).json({ error: 'Course or Student not found' });
    }

    // Generate certificate (simplified example)
    const certificate = await Certificate.create({
      student: student._id,
      course: course._id,
      issuedDate: new Date(),
      certificateUrl: `/certificates/${student._id}_${course._id}.pdf`
    });

    // TODO: Send email here if needed

    res.status(200).json({ message: 'Certificate generated', certificate });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ error: 'Server error while generating certificate' });
  }
};