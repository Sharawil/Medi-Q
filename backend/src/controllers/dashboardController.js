const Patient = require('../models/Patient.model');
const Symptom = require('../models/Symptom.model');
const QueueToken = require('../models/QueueToken.model');

// @desc    Get doctor dashboard data
// @route   GET /api/dashboard/doctor
// @access  Private (Doctor)
exports.getDoctorDashboard = async (req, res) => {
  try {
    // Check if user is a doctor
    // In our simplified flow, we'll assume validation is done via middleware
    // For now, we'll proceed with getting the data

    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get queue tokens for today, ordered by check-in time (FIFO)
    const queueTokens = await QueueToken.find({
      checkInTime: { $gte: today },
      status: { $in: ['waiting', 'called', 'in-consultation'] }
    })
    .populate('patientId', 'name age bloodGroup phone')
    .populate('symptomId', 'bodyPart symptomAnswers')
    .sort({
      checkInTime: 1     // First in, first served
    });

    // Format patient data for dashboard
    const patients = queueTokens.map(token => ({
      id: token._id,
      tokenNumber: token.tokenNumber,
      patient: {
        id: token.patientId._id,
        name: token.patientId.name,
        age: token.patientId.age,
        bloodGroup: token.patientId.bloodGroup,
        phone: token.patientId.phone
      },
      symptoms: {
        bodyPart: token.symptomId.bodyPart,
        symptomAnswers: token.symptomId.symptomAnswers
      },
      status: token.status,
      checkInTime: token.checkInTime
    }));

    // Get statistics
    const waitingCount = queueTokens.filter(t => t.status === 'waiting').length;
    const calledCount = queueTokens.filter(t => t.status === 'called').length;
    const inConsultationCount = queueTokens.filter(t => t.status === 'in-consultation').length;

    res.json({
      patients,
      stats: {
        waiting: waitingCount,
        called: calledCount,
        'in-consultation': inConsultationCount
      }
    });
  } catch (error) {
    console.error('Get doctor dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reception/nurse dashboard data
// @route   GET /api/dashboard/reception
// @access  Private (Nurse/Admin)
exports.getReceptionDashboard = async (req, res) => {
  try {
    // Check if user has appropriate role
    // In our simplified flow, we'll assume validation is done via middleware
    // For now, we'll proceed with getting the data

    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active queue tokens for today
    const queueTokens = await QueueToken.find({
      checkInTime: { $gte: today }
    })
    .populate('patientId', 'name age bloodGroup phone')
    .populate('symptomId', 'bodyPart symptomAnswers')
    .sort({
      checkInTime: 1     // First in, first served
    });

    // Format patient data for dashboard
    const patients = queueTokens.map(token => ({
      id: token._id,
      tokenNumber: token.tokenNumber,
      patient: {
        id: token.patientId._id,
        name: token.patientId.name,
        age: token.patientId.age,
        bloodGroup: token.patientId.bloodGroup,
        phone: token.patientId.phone
      },
      symptoms: {
        bodyPart: token.symptomId.bodyPart,
        symptomAnswers: token.symptomId.symptomAnswers
      },
      status: token.status,
      checkInTime: token.checkInTime
    }));

    // Get statistics
    const waitingCount = queueTokens.filter(t => t.status === 'waiting').length;
    const calledCount = queueTokens.filter(t => t.status === 'called').length;
    const inConsultationCount = queueTokens.filter(t => t.status === 'in-consultation').length;
    const completedCount = queueTokens.filter(t => t.status === 'completed').length;

    res.json({
      patients,
      stats: {
        waiting: waitingCount,
        called: calledCount,
        'in-consultation': inConsultationCount,
        completed: completedCount
      }
    });
  } catch (error) {
    console.error('Get reception dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDoctorDashboard: exports.getDoctorDashboard,
  getReceptionDashboard: exports.getReceptionDashboard
};