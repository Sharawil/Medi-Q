const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  // Reference to the patient this symptom data belongs to
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  // Selected body part
  bodyPart: {
    type: String,
    required: [true, 'Please specify the body part']
  },
  // Symptom answers (simplified storage)
  symptomAnswers: {
    type: mongoose.Schema.Types.Mixed, // Store the symptom answers as an object
    required: true
  },
  // Optional: could add timestamp for when symptoms were recorded
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This adds createdAt and updatedAt
});

// Indexes for better query performance
symptomSchema.index({ patientId: 1 });
symptomSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Symptom', symptomSchema);