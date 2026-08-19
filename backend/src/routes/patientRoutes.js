const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware.protect);

// Patient profile routes
router.post('/', patientController.createPatientProfile);
router.get('/me', patientController.getPatientProfile);
router.put('/me', patientController.updatePatientProfile);
router.get('/me/history', patientController.getVisitHistory);

// Admin/staff routes
router.get('/', patientController.getAllPatients);

module.exports = router;