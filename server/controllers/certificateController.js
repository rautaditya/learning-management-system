const Certificate = require('../models/Certificate');

exports.getAllCertificates = async (req, res) => {
  const certificates = await Certificate.find()
    .populate('student', 'fullName email')
    .populate('course', 'title');
  res.json(certificates);
};

exports.getCertificatesByStudent = async (req, res) => {
  const { studentId } = req.params;
  const certs = await Certificate.find({ student: studentId })
    .populate('course', 'title');
  res.json(certs);
};
