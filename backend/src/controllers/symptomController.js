const Symptom = require('../models/Symptom.model');
const Patient = require('../models/Patient.model');
const QueueToken = require('../models/QueueToken.model');
const { validationResult } = require('express-validator');

// @desc    Submit symptom data
// @route   POST /api/symptoms
// @access  Private
const submitSymptoms = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get patient profile from token (in our simplified flow, we pass patient data directly)
    // For now, we'll expect patient data in req.body from frontend
    const { patientData, bodyPart, symptomAnswers } = req.body;

    if (!patientData || !bodyPart || !symptomAnswers) {
      return res.status(400).json({ message: 'Patient data, body part, and symptom answers are required' });
    }

    // Create or find patient record
    let patient = await Patient.findOne({
      name: patientData.name,
      age: patientData.age,
      bloodGroup: patientData.bloodGroup
    });

    if (!patient) {
      // Create new patient record
      patient = new Patient({
        name: patientData.name,
        age: patientData.age,
        bloodGroup: patientData.bloodGroup,
        phone: patientData.phone || ''
      });
      await patient.save();
    }

    // Create symptom record
    const symptom = new Symptom({
      patientId: patient._id,
      bodyPart: bodyPart,
      symptomAnswers: symptomAnswers
    });
    await symptom.save();

    // Generate token number and add to queue
    const tokenNumber = await QueueToken.generateNextTokenNumber();

    const queueToken = new QueueToken({
      patientId: patient._id,
      symptomId: symptom._id,
      tokenNumber: tokenNumber,
      status: 'waiting' // Default status
    });

    await queueToken.save();

    // Update patient with token reference
    patient.token = queueToken._id;
    await patient.save();

    res.status(201).json({
      message: 'Symptoms submitted successfully',
      symptom,
      queueToken: {
        tokenNumber: queueToken.tokenNumber,
        _id: queueToken._id
      }
    });
  } catch (error) {
    console.error('Submit symptoms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get symptom records for a patient
// @route   GET /api/symptoms/me
// @access  Private
const getPatientSymptoms = async (req, res) => {
  try {
    // In our simplified flow, we don't have patient login
    // This endpoint might not be used, but we'll keep it for completeness
    res.json([]);
  } catch (error) {
    console.error('Get patient symptoms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get symptom by ID
// @route   GET /api/symptoms/:id
// @access  Private
const getSymptomById = async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    if (!symptom) {
      return res.status(404).json({ message: 'Symptom record not found' });
    }

    res.json(symptom);
  } catch (error) {
    console.error('Get symptom by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update symptom (for doctor notes)
// @route   PUT /api/symptoms/:id
// @access  Private (Doctor/Nurse)
const updateSymptom = async (req, res) => {
  try {
    // Check if user has appropriate role
    // In our simplified flow, we'll assume doctor role is validated elsewhere
    const { doctorNotes } = req.body;

    const symptom = await Symptom.findByIdAndUpdate(
      req.params.id,
      { $set: { 'symptomAnswers.doctorNotes': doctorNotes } },
      { new: true, runValidators: true }
    );

    if (!symptom) {
      return res.status(404).json({ message: 'Symptom record not found' });
    }

    res.json({
      message: 'Symptom updated successfully',
      symptom
    });
  } catch (error) {
    console.error('Update symptom error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all symptoms (for staff dashboard)
// @route   GET /api/symptoms
// @access  Private (Doctor/Nurse/Admin)
const getAllSymptoms = async (req, res) => {
  try {
    // Check if user has appropriate role
    // In our simplified flow, we'll assume validation is done elsewhere
    const symptoms = await Symptom.find()
      .populate('patientId', 'name age bloodGroup phone')
      .sort({ createdAt: -1 });

    res.json(symptoms);
  } catch (error) {
    console.error('Get all symptoms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitSymptoms,
  getPatientSymptoms,
  getSymptomById,
  updateSymptom,
  getAllSymptoms
};