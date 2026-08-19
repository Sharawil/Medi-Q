const Patient = require('../models/Patient.model');
const User = require('../models/User.model');
const { validationResult } = require('express-validator');

// @desc    Create patient profile
// @route   POST /api/patients
// @access  Private
exports.createPatientProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName, lastName, dateOfBirth, gender, phone, email,
      address, emergencyContact, medicalHistory, insurance
    } = req.body;

    // Check if user exists and is a patient
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'patient' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only patients can create patient profiles' });
    }

    // Check if patient profile already exists for this user
    let patient = await Patient.findOne({ userId: req.user.userId });
    if (patient) {
      return res.status(400).json({ message: 'Patient profile already exists' });
    }

    // Create new patient profile
    patient = new Patient({
      userId: req.user.userId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      emergencyContact,
      medicalHistory,
      insurance
    });

    await patient.save();

    res.status(201).json({
      message: 'Patient profile created successfully',
      patient
    });
  } catch (error) {
    console.error('Create patient profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patient profile
// @route   GET /api/patients/me
// @access  Private
exports.getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/me
// @access  Private
exports.updatePatientProfile = async (req, res) => {
  try {
    const {
      firstName, lastName, dateOfBirth, gender, phone, email,
      address, emergencyContact, medicalHistory, insurance
    } = req.body;

    const patient = await Patient.findOneAndUpdate(
      { userId: req.user.userId },
      {
        firstName, lastName, dateOfBirth, gender, phone, email,
        address, emergencyContact, medicalHistory, insurance
      },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({
      message: 'Patient profile updated successfully',
      patient
    });
  } catch (error) {
    console.error('Update patient profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patient visit history
// @route   GET /api/patients/me/history
// @access  Private
exports.getVisitHistory = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.userId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({
      visits: patient.visits || []
    });
  } catch (error) {
    console.error('Get visit history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all patients (for staff/admin)
// @route   GET /api/patients
// @access  Private (Doctor/Nurse/Admin)
exports.getAllPatients = async (req, res) => {
  try {
    // Check if user has appropriate role
    if (!['doctor', 'nurse', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patients = await Patient.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPatientProfile: exports.createPatientProfile,
  getPatientProfile: exports.getPatientProfile,
  updatePatientProfile: exports.updatePatientProfile,
  getVisitHistory: exports.getVisitHistory,
  getAllPatients: exports.getAllPatients
};