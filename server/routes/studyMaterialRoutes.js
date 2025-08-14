const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  addStudyMaterial,
  getStudyMaterialsByAdmin,
  getAllStudyMaterials,
  deleteStudyMaterial,getStudentStudyMaterials ,
  updateStudyMaterial
} = require('../controllers/studyMaterialController');

const { uploadStudyMaterial } = require('../middleware/upload');

router.post('/study-material', verifyToken(['admin', 'superadmin']), uploadStudyMaterial, addStudyMaterial);
router.get('/study-materials/admin', verifyToken(['admin', 'superadmin']), getStudyMaterialsByAdmin);
router.get('/study-materials', verifyToken(['superadmin', 'admin']), getAllStudyMaterials);
router.delete('/study-material/:id', verifyToken(['admin', 'superadmin']), deleteStudyMaterial);

// ✅ New: Update route with file support
router.put('/study-material/:id', verifyToken(['admin', 'superadmin']), uploadStudyMaterial, updateStudyMaterial);
router.get('/study-materials/student', verifyToken(['student']), getStudentStudyMaterials);

module.exports = router;
