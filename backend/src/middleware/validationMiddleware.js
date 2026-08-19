const { body, validationResult } = require('express-validator');

// Register validator
exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['patient', 'doctor', 'nurse', 'admin'])
    .withMessage('Role must be either patient, doctor, nurse, or admin'),
  body('phone').optional().trim().isMobilePhone().withMessage('Please provide a valid phone number')
];

// Login validator
exports.loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
];

// Symptom validator - updated for our simplified structure
exports.symptomValidator = [
  body('patientData.name').trim().notEmpty().withMessage('Patient name is required'),
  body('patientData.age')
    .isInt({ min: 1, max: 150 })
    .withMessage('Please provide a valid age between 1 and 150'),
  body('patientData.bloodGroup')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Please provide a valid blood group'),
  body('patientData.phone').optional().trim(),
  body('bodyPart').trim().notEmpty().withMessage('Body part is required'),
  body('bodyPart').isIn([
    'Head', 'Eyes', 'Ear', 'Nose', 'Throat',
    'Chest', 'Stomach', 'Hand', 'Leg', 'Back', 'Skin', 'Other'
  ]).withMessage('Please select a valid body part'),
  body('symptomAnswers').isObject().withMessage('Symptom answers must be an object')
];

// Patient profile validator
exports.patientProfileValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('dateOfBirth')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid date of birth')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate > today) {
        throw new Error('Date of birth cannot be in the future');
      }
      // Optional: check if person is too old (e.g., > 150 years)
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age > 150) {
        throw new Error('Please provide a valid date of birth');
      }
      return true;
    }),
  body('gender')
    .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
    .withMessage('Please select a valid gender'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.state').optional().trim(),
  body('address.postalCode').optional().trim(),
  body('address.country').optional().trim(),
  body('emergencyContact.name').optional().trim(),
  body('emergencyContact.phone').optional().isMobilePhone().withMessage('Please provide a valid emergency contact phone number'),
  body('emergencyContact.relationship').optional().trim(),
  body('medicalHistory.allergies').optional().isArray(),
  body('medicalHistory.chronicConditions').optional().isArray(),
  body('medicalHistory.currentMedications').optional().isArray(),
  body('medicalHistory.pastSurgeries').optional().isArray(),
  body('medicalHistory.familyHistory').optional().isArray(),
  body('insurance.provider').optional().trim(),
  body('insurance.policyNumber').optional().trim(),
  body('insurance.groupNumber').optional().trim()
];