const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Donor auth
router.post('/donor/register', authController.registerDonor);
router.post('/donor/login', authController.loginDonor);
router.get('/donor/me', authMiddleware('donor'), authController.getDonorProfile);
router.put('/donor/me', authMiddleware('donor'), authController.updateDonorProfile);

// Hospital auth
router.post('/hospital/register', authController.registerHospital);
router.post('/hospital/login', authController.loginHospital);
router.get('/hospital/me', authMiddleware('hospital'), authController.getHospitalProfile);
router.put('/hospital/me', authMiddleware('hospital'), authController.updateHospitalProfile);

// Admin auth
router.post('/admin/login', authController.loginAdmin);

module.exports = router;

