const QueueToken = require('../models/QueueToken.model');
const Patient = require('../models/Patient.model');
const Symptom = require('../models/Symptom.model');

// @desc    Get daily queue report
// @route   GET /api/reports/daily
// @access  Private (Admin/Doctor/Nurse)
exports.getDailyReport = async (req, res) => {
  try {
    if (!['admin', 'doctor', 'nurse'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get queue stats for today
    const statusStats = await QueueToken.aggregate([
      {
        $match: {
          isActive: true,
          checkInTime: { $gte: today }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Priority breakdown
    const priorityStats = await QueueToken.aggregate([
      {
        $match: {
          isActive: true,
          checkInTime: { $gte: today },
          status: { $in: ['waiting', 'called'] }
        }
      },
      {
        $group: {
          _id: '$priorityLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Average wait time
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
          avgWaitTime: { $avg: '$actualWaitTime' },
          totalCompleted: { $sum: 1 }
        }
      }
    ]);

    // Patients per hour
    const hourlyStats = await QueueToken.aggregate([
      {
        $match: {
          isActive: true,
          checkInTime: { $gte: today }
        }
      },
      {
        $group: {
          _id: { $hour: '$checkInTime' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      date: today,
      statusBreakdown: statusStats,
      priorityBreakdown: priorityStats,
      averageWaitTime: avgWaitTime.length > 0 ? avgWaitTime[0].avgWaitTime : 0,
      totalCompleted: avgWaitTime.length > 0 ? avgWaitTime[0].totalCompleted : 0,
      hourlyBreakdown: hourlyStats
    });
  } catch (error) {
    console.error('Get daily report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get weekly queue report
// @route   GET /api/reports/weekly
// @access  Private (Admin/Doctor/Nurse)
exports.getWeeklyReport = async (req, res) => {
  try {
    if (!['admin', 'doctor', 'nurse'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    // Daily patient counts
    const dailyStats = await QueueToken.aggregate([
      {
        $match: {
          isActive: true,
          checkInTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$checkInTime' }
          },
          totalPatients: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          noShow: {
            $sum: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] }
          },
          avgWaitTime: { $avg: '$actualWaitTime' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Priority distribution over week
    const priorityDistribution = await QueueToken.aggregate([
      {
        $match: {
          isActive: true,
          checkInTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$priorityLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top symptoms
    const topSymptoms = await Symptom.aggregate([
      {
        $match: {
          isActive: true,
          visitDate: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: '$affectedAreas' },
      {
        $group: {
          _id: '$affectedAreas.bodyPart',
          count: { $sum: 1 },
          avgSeverity: { $avg: '$affectedAreas.severity' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      period: { startDate, endDate },
      dailyBreakdown: dailyStats,
      priorityDistribution,
      topSymptoms
    });
  } catch (error) {
    console.error('Get weekly report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get monthly queue report
// @route   GET /api/reports/monthly
// @access  Private (Admin)
exports.getMonthlyReport = async (req, res) => {
  try {
    if (!['admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);
    startDate.setHours(0, 0, 0, 0);

    // Monthly overview
    const monthlyStats = await QueueToken.aggregate([
      {
        $match: {
          isActive: true,
          checkInTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalPatients: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          noShow: { $sum: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] } },
          avgWaitTime: { $avg: '$actualWaitTime' }
        }
      }
    ]);

    // Department/doctor performance (if we had doctor assignment)
    // For now, just return basic stats

    res.json({
      period: { startDate, endDate },
      overview: monthlyStats.length > 0 ? monthlyStats[0] : {},
      // Additional metrics would go here
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patient demographics report
// @route   GET /api/reports/demographics
// @access  Private (Admin)
exports.getDemographicsReport = async (req, res) => {
  try {
    if (!['admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Age distribution
    const patients = await Patient.find({ isActive: true }).select('dateOfBirth gender');

    const ageDistribution = patients.reduce((acc, patient) => {
      if (patient.dateOfBirth) {
        const birthDate = new Date(patient.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        let ageGroup;
        if (age < 18) ageGroup = '0-17';
        else if (age < 30) ageGroup = '18-29';
        else if (age < 40) ageGroup = '30-39';
        else if (age < 50) ageGroup = '40-49';
        else if (age < 60) ageGroup = '50-59';
        else if (age < 70) ageGroup = '60-69';
        else ageGroup = '70+';

        acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      }
      return acc;
    }, {});

    // Gender distribution
    const genderDistribution = patients.reduce((acc, patient) => {
      const gender = patient.gender || 'unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    res.json({
      ageDistribution,
      genderDistribution,
      totalPatients: patients.length
    });
  } catch (error) {
    console.error('Get demographics report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get performance metrics
// @route   GET /api/reports/performance
// @access  Private (Admin/Doctor/Nurse)
exports.getPerformanceMetrics = async (req, res) => {
  try {
    if (!['admin', 'doctor', 'nurse'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Peak hours analysis
    const peakHours = await QueueToken.aggregate([
      {
        $match: {
          isActive: true,
          checkInTime: { $gte: today }
        }
      },
      {
        $group: {
          _id: { $hour: '$checkInTime' },
          patientCount: { $sum: 1 },
          avgWaitTime: { $avg: '$estimatedWaitTime' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Queue throughput
    const throughput = await QueueToken.aggregate([
      {
        $match: {
          isActive: true,
          checkInTime: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          totalArrived: { $sum: 1 },
          totalCompleted: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          totalCancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
        }
      }
    ]);

    // Average consultation duration
    const avgConsultation = await QueueToken.aggregate([
      {
        $match: {
          isActive: true,
          status: 'completed',
          consultationStartTime: { $ne: null },
          consultationEndTime: { $ne: null },
          consultationEndTime: { $gte: today }
        }
      },
      {
        $project: {
          duration: { $divide: [{ $subtract: ['$consultationEndTime', '$consultationStartTime'] }, 1000 * 60] }
        }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$duration' },
          minDuration: { $min: '$duration' },
          maxDuration: { $max: '$duration' }
        }
      }
    ]);

    res.json({
      peakHours,
      throughput: throughput.length > 0 ? throughput[0] : {},
      consultationDuration: avgConsultation.length > 0 ? avgConsultation[0] : {}
    });
  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};