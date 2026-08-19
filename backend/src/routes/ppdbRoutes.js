const express = require('express');
const router = express.Router();
const {
  register,
  getRegistrations,
  getRegistrationByRegNumber,
  updateStatus,
  deleteRegistration
} = require('../controllers/ppdbController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const { ppdbUpload } = require('../middleware/uploadMiddleware');

router.post('/register', (req, res, next) => {
  ppdbUpload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'Ukuran file terlalu besar. Maksimal 2MB per file.' });
      }
      if (err.message === 'Images and PDFs only!') {
        return res.status(400).json({ message: 'Format file tidak valid. Hanya file PDF atau JPG/PNG yang diperbolehkan.' });
      }
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, register);
router.get('/registrations', protect, requireRole('Admin'), getRegistrations);
router.get('/registrations/:regNumber', getRegistrationByRegNumber);
router.patch('/registrations/:id/status', protect, requireRole('Admin'), updateStatus);
router.delete('/registrations/:id', protect, requireRole('Admin'), deleteRegistration);

module.exports = router;
