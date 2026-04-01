const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  allergies: {
    type: [String],
    default: [],
  },
  conditions: {
    type: [String],
    default: [],
  },
  treatments: [
    {
      date: { type: Date, default: Date.now },
      description: { type: String, required: true },
      tooth: { type: String, default: '' },
      cost: { type: Number, default: 0 },
      appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    },
  ],
  notes: {
    type: String,
    default: '',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);