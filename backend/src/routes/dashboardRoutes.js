const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware.protect);

// Doctor dashboard
router.get('/doctor', authMiddleware.protect, dashboardController.getDoctorDashboard);

// Reception/Nurse dashboard
router.get('/reception', authMiddleware.protect, dashboardController.getReceptionDashboard);

module.exports = router;