const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/ppdb/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf/i;
  const extname = filetypes.test(path.extname(file.originalname));
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images and PDFs only!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

const ppdbUpload = upload.fields([
  { name: 'pasFoto', maxCount: 1 },
  { name: 'ijazah', maxCount: 1 },
  { name: 'rapor', maxCount: 1 },
  { name: 'kartuKeluarga', maxCount: 1 },
  { name: 'aktaKelahiran', maxCount: 1 },
  { name: 'suratKeterangan', maxCount: 1 }
]);

module.exports = { ppdbUpload };
