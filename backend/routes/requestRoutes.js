const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

// @route POST /api/requests
// @access Private (Hospital)
router.post('/', authMiddleware('hospital'), requestController.createRequest);

// @route GET /api/requests/hospital
// @access Private (Hospital)
router.get('/hospital', authMiddleware('hospital'), requestController.getHospitalRequests);

// @route GET /api/requests/donor
// @access Private (Donor)
router.get('/donor', authMiddleware('donor'), requestController.getDonorRequests);

// @route PUT /api/requests/:id
// @access Private (Donor)
router.put('/:id', authMiddleware('donor'), requestController.updateRequestStatus);
router.delete('/:id', authMiddleware('hospital'), requestController.deleteRequest);

module.exports = router;
