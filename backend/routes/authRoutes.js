const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Multer config for hospital file uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only JPG, PNG, and PDF files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

// Donor auth
router.post('/donor/register', authController.registerDonor);
router.post('/donor/login', authController.loginDonor);
router.get('/donor/me', authMiddleware('donor'), authController.getDonorProfile);
router.put('/donor/me', authMiddleware('donor'), authController.updateDonorProfile);

// Hospital auth
router.post('/hospital/register', upload.fields([
  { name: 'licenseFile', maxCount: 1 },
  { name: 'idProofFile', maxCount: 1 }
]), authController.registerHospital);
router.post('/hospital/login', authController.loginHospital);
router.get('/hospital/me', authMiddleware('hospital'), authController.getHospitalProfile);
router.put('/hospital/me', authMiddleware('hospital'), authController.updateHospitalProfile);

// Admin auth
router.post('/admin/login', authController.loginAdmin);

module.exports = router;
