const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');
const authMiddleware = require('../middleware/authMiddleware');
const { symptomValidator } = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(authMiddleware.protect);

// Symptom routes
router.post('/', symptomValidator, symptomController.submitSymptoms);
router.get('/me', symptomController.getPatientSymptoms);
router.get('/:id', symptomController.getSymptomById);
router.put('/:id', symptomController.updateSymptom);

// Admin/staff routes
router.get('/', symptomController.getAllSymptoms);

module.exports = router;