const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please provide your age'],
    min: [1, 'Age must be at least 1'],
    max: [150, 'Age must be realistic']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Please provide your blood group'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  phone: {
    type: String,
    trim: true
  },
  // Reference to the queue token this patient data is associated with
  token: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QueueToken',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
patientSchema.index({ token: 1 });

module.exports = mongoose.model('Patient', patientSchema);