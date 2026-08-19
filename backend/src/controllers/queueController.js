const QueueToken = require('../models/QueueToken.model');
const Patient = require('../models/Patient.model');
const Symptom = require('../models/Symptom.model');
const { validationResult } = require('express-validator');

// @desc    Get queue tokens
// @route   GET /api/queue
// @access  Private
exports.getQueueTokens = async (req, res) => {
  try {
    // Check if user has appropriate role (staff can see all, patients see only theirs)
    let query = {};
    if (!['doctor', 'nurse', 'admin'].includes(req.user.role)) {
      // Patient can only see their own queue tokens
      const patient = await Patient.findOne({ userId: req.user.userId });
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      query.patientId = patient._id;
    }

    const queueTokens = await QueueToken.find(query)
      .populate('patientId', 'firstName lastName phone email')
      .populate('symptomId', 'priorityLevel painLevel fever chestPain shortnessOfBreath')
      .sort({
        // Emergency first, then by priority level, then by check-in time
        priorityLevel: -1,
        checkInTime: 1
      });

    // Calculate current wait times
    const updatedTokens = await Promise.all(queueTokens.map(async (token) => {
      if (token.status === 'waiting' || token.status === 'called') {
        // Recalculate estimated wait time based on current queue position
        token.estimatedWaitTime = await calculateEstimatedWaitTime(token);
      }
      return token;
    }));

    res.json(updatedTokens);
  } catch (error) {
    console.error('Get queue tokens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get queue token by ID
// @route   GET /api/queue/:id
// @access  Private
exports.getQueueTokenById = async (req, res) => {
  try {
    let query = { _id: req.params.id };

    // If patient, check ownership
    if (!['doctor', 'nurse', 'admin'].includes(req.user.role)) {
      const patient = await Patient.findOne({ userId: req.user.userId });
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      query.patientId = patient._id;
    }

    const queueToken = await QueueToken.findOne(query)
      .populate('patientId', 'firstName lastName phone email')
      .populate('symptomId');

    if (!queueToken) {
      return res.status(404).json({ message: 'Queue token not found' });
    }

    res.json(queueToken);
  } catch (error) {
    console.error('Get queue token by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update queue token status
// @route   PUT /api/queue/:id
// @access  Private (Doctor/Nurse)
exports.updateQueueTokenStatus = async (req, res) => {
  try {
    // Check if user has appropriate role
    if (!['doctor', 'nurse', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, notes } = req.body;
    const updateData = { status };

    // Set timestamps based on status
    if (status === 'called') {
      updateData.calledTime = new Date();
    } else if (status === 'in-consultation') {
      updateData.consultationStartTime = new Date();
    } else if (status === 'completed' || status === 'cancelled') {
      updateData.consultationEndTime = new Date();

      // Calculate actual wait time if completed
      if (status === 'completed') {
        const queueToken = await QueueToken.findById(req.params.id);
        if (queueToken && queueToken.checkInTime && queueToken.consultationStartTime) {
          const waitTimeMs = queueToken.consultationStartTime - queueToken.checkInTime;
          updateData.actualWaitTime = Math.floor(waitTimeMs / (1000 * 60)); // Convert to minutes
        }
      }
    }

    if (notes) updateData.notes = notes;

    const queueToken = await QueueToken.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!queueToken) {
      return res.status(404).json({ message: 'Queue token not found' });
    }

    // Emit socket event for real-time updates
    const emitQueueUpdate = req.app.get('emitQueueUpdate');
    if (emitQueueUpdate) {
      emitQueueUpdate({
        type: 'QUEUE_TOKEN_UPDATED',
        payload: queueToken
      });
    }

    res.json({
      message: 'Queue token status updated successfully',
      queueToken
    });
  } catch (error) {
    console.error('Update queue token status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get queue statistics
// @route   GET /api/queue/stats
// @access  Private (Doctor/Nurse/Admin)
exports.getQueueStats = async (req, res) => {
  try {
    // Check if user has appropriate role
    if (!['doctor', 'nurse', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const stats = await QueueToken.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get priority breakdown
    const priorityStats = await QueueToken.aggregate([
      {
        $match: { isActive: true, status: { $in: ['waiting', 'called'] } }
      },
      {
        $group: {
          _id: '$priorityLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate average wait time for completed consultations today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const avgWaitTime = await QueueToken.aggregate([
      {
        $match: {
          isActive: true,
          status: 'completed',
          consultationEndTime: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          avgWaitTime: { $avg: '$actualWaitTime' }
        }
      }
    ]);

    res.json({
      statusBreakdown: stats,
      priorityBreakdown: priorityStats,
      averageWaitTimeToday: avgWaitTime.length > 0 ? avgWaitTime[0].avgWaitTime : 0
    });
  } catch (error) {
    console.error('Get queue stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate estimated wait time based on queue position
const calculateEstimatedWaitTime = async (queueToken) => {
  try {
    // Count patients ahead in queue with same or higher priority
    const priorityOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
    const patientPriority = priorityOrder[queueToken.priorityLevel] || 0;

    const countAhead = await QueueToken.countDocuments({
      isActive: true,
      status: { $in: ['waiting', 'called'] },
      $or: [
        { priorityLevel: 'emergency' }, // All emergencies go first
        {
          priorityLevel: queueToken.priorityLevel,
          checkInTime: { $lt: queueToken.checkInTime } // Same priority, earlier check-in
        }
      ]
    });

    // Base time per patient (minutes) - this would be configurable in a real system
    const baseTimePerPatient = {
      emergency: 5,
      high: 10,
      medium: 15,
      low: 20
    };

    const baseTime = baseTimePerPatient[queueToken.priorityLevel] || 15;
    return countAhead * baseTime;
  } catch (error) {
    console.error('Calculate estimated wait time error:', error);
    return 0;
  }
};

module.exports = {
  getQueueTokens: exports.getQueueTokens,
  getQueueTokenById: exports.getQueueTokenById,
  updateQueueTokenStatus: exports.updateQueueTokenStatus,
  getQueueStats: exports.getQueueStats
};