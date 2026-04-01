const Appointment = require('../models/Appointment');

// CLIENT — Prendre RDV
const createAppointment = async (req, res) => {
  try {
    const { date, time, type, notes } = req.body;

    // Vérifier si créneau déjà pris
    const existing = await Appointment.findOne({ date, time, status: { $ne: 'cancelled' } });
    if (existing) {
      return res.status(400).json({ message: 'Ce créneau est déjà réservé' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      date,
      time,
      type,
      notes,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLIENT — Mes RDV
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN — Tous les RDV
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email phone')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN — Changer status RDV
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('patient', 'name email phone');

    if (!appointment) {
      return res.status(404).json({ message: 'RDV introuvable' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLIENT — Annuler RDV
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'RDV introuvable' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'RDV annulé', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};