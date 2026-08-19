// Triage service for calculating priority levels and scores

/**
 * Calculate priority level based on symptom data
 * @param {Object} symptomData - Symptom data object
 * @returns {string} Priority level: 'low', 'medium', 'high', or 'emergency'
 */
const calculatePriorityLevel = (symptomData) => {
  let score = 0;

  // Pain level contributes significantly to score
  if (symptomData.painLevel !== undefined) {
    score += symptomData.painLevel * 2; // 0-20 points
  }

  // Fever adds points
  if (symptomData.fever) {
    score += 15;
    if (symptomData.feverTemperature && symptomData.feverTemperature >= 39) { // High fever
      score += 10;
    }
  }

  // Severe symptoms
  const severeSymptoms = ['chestPain', 'shortnessOfBreath'];
  severeSymptoms.forEach(symptom => {
    if (symptomData[symptom]) {
      score += 20;
    }
  });

  // Moderate symptoms
  const moderateSymptoms = ['nausea', 'vomiting', 'dizziness', 'headache', 'fatigue'];
  moderateSymptoms.forEach(symptom => {
    if (symptomData[symptom]) {
      score += 10;
    }
  });

  // Duration factor - longer duration might indicate chronic issue
  if (symptomData.symptomDuration) {
    const durationInMinutes = convertToMinutes(
      symptomData.symptomDuration.value,
      symptomData.symptomDuration.unit
    );

    if (durationInMinutes > 1440) { // More than 24 hours
      score += 5;
    }
    if (durationInMinutes > 4320) { // More than 3 days
      score += 10;
    }
  }

  // Frequency factor
  const frequencyScores = {
    constant: 15,
    frequent: 10,
    occasional: 5,
    rare: 0
  };
  if (symptomData.symptomFrequency) {
    score += frequencyScores[symptomData.symptomFrequency] || 0;
  }

  // Affected areas severity
  if (symptomData.affectedAreas && Array.isArray(symptomData.affectedAreas)) {
    symptomData.affectedAreas.forEach(area => {
      if (area.severity !== undefined) {
        score += area.severity * 1.5; // 1.5x severity score
      }
    });
  }

  // Cap score at 100
  score = Math.min(score, 100);

  // Determine priority level based on score
  if (score >= 85) return 'emergency';
  if (score >= 60) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
};

/**
 * Calculate triage score (0-100) based on symptom data
 * @param {Object} symptomData - Symptom data object
 * @returns {number} Triage score
 */
const calculateTriageScore = (symptomData) => {
  // Simplified triage score calculation (0-100)
  return Math.min(
    ((symptomData.painLevel || 0) * 2) +
    (symptomData.fever ? 15 : 0) +
    (symptomData.chestPain ? 20 : 0) +
    (symptomData.shortnessOfBreath ? 20 : 0),
    100
  );
};

/**
 * Helper function to convert duration to minutes
 * @param {number} value - Duration value
 * @param {string} unit - Duration unit (seconds, minutes, hours, days, weeks)
 * @returns {number} Duration in minutes
 */
const convertToMinutes = (value, unit) => {
  switch (unit) {
    case 'seconds': return value / 60;
    case 'minutes': return value;
    case 'hours': return value * 60;
    case 'days': return value * 60 * 24;
    case 'weeks': return value * 60 * 24 * 7;
    default: return 0;
  }
};

module.exports = {
  calculatePriorityLevel,
  calculateTriageScore
};