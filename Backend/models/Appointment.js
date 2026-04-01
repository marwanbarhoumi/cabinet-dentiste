const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Date obligatoire'],
  },
  time: {
    type: String,
    required: [true, 'Heure obligatoire'],
  },
  type: {
    type: String,
    enum: ['consultation', 'detartrage', 'extraction', 'implant', 'blanchiment', 'autre'],
    default: 'consultation',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);