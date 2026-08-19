const mongoose = require('mongoose');

const queueTokenSchema = new mongoose.Schema({
  // Reference to the patient this token belongs to
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  // Reference to the symptom data for this patient
  symptomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Symptom',
    required: true
  },
  // Token number in format P-01, P-02, etc. (we'll store just the number and format in frontend)
  tokenNumber: {
    type: Number,
    required: true,
    unique: true
  },
  // Status of the token in the queue
  status: {
    type: String,
    enum: ['waiting', 'called', 'in-consultation', 'completed'],
    default: 'waiting'
  },
  // Time when patient checked in
  checkInTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This adds createdAt and updatedAt
});

// Indexes for better query performance
queueTokenSchema.index({ tokenNumber: 1 });
queueTokenSchema.index({ patientId: 1 });
queueTokenSchema.index({ status: 1 });
queueTokenSchema.index({ checkInTime: 1 });

// Static method to generate next token number
queueTokenSchema.statics.generateNextTokenNumber = async function() {
  const lastToken = await this.findOne().sort('-tokenNumber');
  return lastToken ? lastToken.tokenNumber + 1 : 1;
};

module.exports = mongoose.model('QueueToken', queueTokenSchema);