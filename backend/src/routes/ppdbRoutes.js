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

router.post('/register', ppdbUpload, register);
router.get('/registrations', protect, requireRole('Admin'), getRegistrations);
router.get('/registrations/:regNumber', getRegistrationByRegNumber);
router.patch('/registrations/:id/status', protect, requireRole('Admin'), updateStatus);
router.delete('/registrations/:id', protect, requireRole('Admin'), deleteRegistration);

module.exports = router;
