const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(authMiddleware('admin'));

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

// Donors Management
router.get('/donors', adminController.getDonors);
router.put('/donors/:id/status', adminController.updateDonorStatus);

// Hospitals Management
router.get('/hospitals', adminController.getHospitals);
router.put('/hospitals/:id/status', adminController.updateHospitalStatus);

module.exports = router;
