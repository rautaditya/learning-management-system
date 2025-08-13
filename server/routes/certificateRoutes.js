// routes/commonRoutes.js (relevant parts)
const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadCertificateTemplate } = require('../middleware/upload');

// Certificate Template Routes
router.post(
  '/certificate-templates',
  verifyToken(['admin', 'superadmin']),
  uploadCertificateTemplate,
  certificateController.createCertificateTemplate
);

router.get(
  '/certificate-templates',
  verifyToken(['admin', 'superadmin']),
  certificateController.getCertificateTemplates
);

router.get(
  '/certificate-templates/:id',
  verifyToken(['admin', 'superadmin']),
  certificateController.getCertificateTemplateById
);

router.put(
  '/certificate-templates/:id',
  verifyToken(['admin', 'superadmin']),
  uploadCertificateTemplate,
  certificateController.updateCertificateTemplate
);

router.delete(
  '/certificate-templates/:id',
  verifyToken(['admin', 'superadmin']),
  certificateController.deleteCertificateTemplate
);

// Course Template link/unlink
router.post(
  '/courses/:courseId/template',
  verifyToken(['admin', 'superadmin']),
  certificateController.setCourseTemplate
);

router.get(
  '/courses/:courseId/template',
  verifyToken(['admin', 'superadmin']),
  certificateController.getCourseTemplate
);
router.get('/courses/list', certificateController.getCourseList);

module.exports = router;
