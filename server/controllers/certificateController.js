// controllers/commonController.js (add/imports at top)
const CertificateTemplate = require('../models/CertificateTemplate');
const Course = require('../models/Course');
const User = require('../models/User');
const path = require('path');

// Helper to convert saved filepath to frontend-friendly URL (adjust if you serve /uploads statically)
const filePathToUrl = (filePath, req) => {
  if (!filePath) return null;
  const p = filePath.replace(/\\/g, '/').replace(/^\.?\/*/, '');
  return `${req.protocol}://${req.get('host')}/${p}`;
};


/**
 * Create Certificate Template
 * multipart/form-data with field 'image' for file
 * body: { name, description, course (optional) }
 */
// Get list of courses (only id and title)
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
    const { name, description, course } = req.body;
    if (!name) return res.status(400).json({ message: 'Template name required' });
    if (!req.file) return res.status(400).json({ message: 'Template image required' });

    const imageUrl = filePathToUrl(req.file.path);

    const template = await CertificateTemplate.create({
      name,
      description: description || '',
      imageUrl,
      course: course || null,
      createdBy: req.user._id
    });

    // If course id provided, link it
    if (course) {
      await Course.findByIdAndUpdate(course, { template: template._id });
    }

    res.json({ message: 'Template created', template });
  } catch (err) {
    console.error('createCertificateTemplate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCertificateTemplates = async (req, res) => {
  try {
    const templates = await CertificateTemplate.find().populate('course', 'title');
    const updatedTemplates = templates.map(t => ({
      ...t.toObject(),
      imageUrl: filePathToUrl(t.imageUrl, req)
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
    if (req.file) update.imageUrl = filePathToUrl(req.file.path);
    if (typeof course !== 'undefined') update.course = course || null;

    const updated = await CertificateTemplate.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Template not found' });

    // if course param provided, link/unlink on Course
    if (typeof course !== 'undefined') {
      // remove template from previous course(s) that had this template?
      // For simplicity, just set the chosen course.template = updated._id (if course provided)
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

    // unlink from any course that referenced it
    await Course.updateMany({ template: deleted._id }, { $set: { template: null } });

    // optionally, delete file from disk (careful)
    // const filePath = path.join(process.cwd(), deleted.imageUrl); // adjust if storing full URL
    // fs.unlink(filePath, ()=>{});

    res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error('deleteCertificateTemplate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Set (or update) a course's certificate template
 * body: { templateId }
 */
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
