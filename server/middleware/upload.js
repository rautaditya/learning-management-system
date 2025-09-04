
// // const multer = require('multer');
// // const path = require('path');
// // const fs = require('fs');

// // // Ensure folders exist
// // const ensureDirExists = (dir) => {
// //   if (!fs.existsSync(dir)) {
// //     fs.mkdirSync(dir, { recursive: true });
// //   }
// // };

// // const videoTypes = ['video/mp4', 'video/mkv', 'video/avi', 'video/mov', 'video/webm'];
// // const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     let uploadPath;
// //     if (videoTypes.includes(file.mimetype)) {
// //       uploadPath = 'uploads/videos/';
// //     } else if (imageTypes.includes(file.mimetype)) {
// //       uploadPath = 'uploads/images/';
// //     } else {
// //       uploadPath = 'uploads/others/';
// //     }

// //     ensureDirExists(uploadPath);
// //     cb(null, uploadPath);
// //   },
// //  filename: function (req, file, cb) {
// //   const ext = path.extname(file.originalname); // .mp4
// //   const baseName = path.basename(file.originalname, ext)
// //     .replace(/[^a-zA-Z0-9-_]/g, '_'); // keep only safe characters

// //   cb(null, `${Date.now()}-${baseName}${ext}`);
// // }

// // });

// // const allowedTypes = [...videoTypes, ...imageTypes, 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// // const fileFilter = (req, file, cb) => {
// //   if (allowedTypes.includes(file.mimetype)) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error('Unsupported file type'), false);
// //   }
// // };

// // const upload = multer({ storage, fileFilter });

// // module.exports = {
// //   uploadSingleVideo: upload.single('uploadvideo'),
// //   uploadSingleImage: upload.single('courseImage'),
// //   uploadProfileImage: upload.single('profileImage'),
// //   uploadGeneric: upload
// // };
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // 📁 Ensure folder exists
// const ensureDirExists = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // 📁 Define file types
// const videoTypes = ['video/mp4', 'video/mkv', 'video/avi', 'video/mov', 'video/webm'];
// const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
// const studyMaterialTypes = [
//   'application/pdf',
//   'application/msword',
//   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//   'application/vnd.ms-powerpoint',
//   'application/vnd.openxmlformats-officedocument.presentationml.presentation'
// ];

// // ✅ Create separate storage for study materials
// const studyMaterialStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = 'uploads/studymaterial/';
//     ensureDirExists(uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
//     cb(null, `${Date.now()}-${baseName}${ext}`);
//   }
// });

// // ✅ Shared file filter
// const allowedTypes = [...videoTypes, ...imageTypes, ...studyMaterialTypes];
// const fileFilter = (req, file, cb) => {
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Unsupported file type'), false);
//   }
// };

// // ✅ Main storage (default for videos/images/others)
// const defaultStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let uploadPath = 'uploads/others/';
//     if (videoTypes.includes(file.mimetype)) uploadPath = 'uploads/videos/';
//     else if (imageTypes.includes(file.mimetype)) uploadPath = 'uploads/images/';
//     ensureDirExists(uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
//     cb(null, `${Date.now()}-${baseName}${ext}`);
//   }
// });
// // ✅ Certificate Template Storage
// const certificateTemplateStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = 'uploads/certificatetemplates/';
//     ensureDirExists(uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
//     cb(null, `${Date.now()}-${baseName}${ext}`);
//   }
// });
// const uploadCertificateTemplate = multer({ storage: certificateTemplateStorage, fileFilter }).single('image');

// // ✅ Export all uploaders
// const upload = multer({ storage: defaultStorage, fileFilter });

// module.exports = {
//   uploadSingleVideo: multer({ storage: defaultStorage, fileFilter }).single('uploadvideo'),
//   uploadSingleImage: multer({ storage: defaultStorage, fileFilter }).single('courseImage'),
//   uploadProfileImage: multer({ storage: defaultStorage, fileFilter }).single('profileImage'),
//   uploadAdminProfileImages: multer({ storage: defaultStorage, fileFilter }).fields([
//     { name: 'profileImage', maxCount: 1 },
//     { name: 'backgroundImage', maxCount: 1 },
//   ]),
//   uploadStudyMaterial: multer({ storage: studyMaterialStorage, fileFilter }).single('file'),
//   uploadGeneric: upload,
//   uploadCertificateTemplate // 👈 added
// };c
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Ensure folder exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 📁 Define file types
const videoTypes = ['video/mp4', 'video/mkv', 'video/avi', 'video/mov', 'video/webm'];
const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const studyMaterialTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

// ✅ Shared file filter
const allowedTypes = [...videoTypes, ...imageTypes, ...studyMaterialTypes];
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// 📁 Filename generator (safe + timestamped)
const generateFilename = (file) => {
  const ext = path.extname(file.originalname);
  const baseName = path
    .basename(file.originalname, ext)
    .replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${Date.now()}-${baseName}${ext}`;
};

// ✅ Main storage (videos/images/others)
const defaultStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/others/';
    if (videoTypes.includes(file.mimetype)) uploadPath = 'uploads/videos/';
    else if (imageTypes.includes(file.mimetype)) uploadPath = 'uploads/images/';
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, generateFilename(file));
  }
});

// ✅ Study material storage
const studyMaterialStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/studymaterial/';
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, generateFilename(file));
  }
});

// ✅ Certificate template storage
const certificateTemplateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/certificatetemplates/';
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, generateFilename(file));
  }
});

// ✅ Assignment submissions storage
const assignmentSubmissionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/assignments/';
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, generateFilename(file));
  }
});

// ✅ Main upload middleware
const upload = multer({ storage: defaultStorage, fileFilter });

// ✅ Export all uploaders
module.exports = {
  uploadSingleVideo: multer({ storage: defaultStorage, fileFilter }).single('uploadvideo'),
  uploadSingleImage: multer({ storage: defaultStorage, fileFilter }).single('courseImage'),
  uploadProfileImage: multer({ storage: defaultStorage, fileFilter }).single('profileImage'),
  uploadAdminProfileImages: multer({ storage: defaultStorage, fileFilter }).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
  ]),
  uploadStudyMaterial: multer({ storage: studyMaterialStorage, fileFilter }).single('file'),
  uploadGeneric: upload,
  uploadCertificateTemplate: multer({ storage: certificateTemplateStorage, fileFilter }).single('image'),
  uploadAssignmentSubmission: multer({
    storage: assignmentSubmissionStorage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  }).single('file'),
};
