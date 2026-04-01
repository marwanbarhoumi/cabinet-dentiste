const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');

// ADMIN — Liste patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'client' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN — Dossier médical d'un patient
const getPatientRecord = async (req, res) => {
  try {
    let record = await MedicalRecord.findOne({ patient: req.params.id })
      .populate('patient', 'name email phone dateOfBirth gender');

    if (!record) {
      // Créer dossier vide si n'existe pas
      record = await MedicalRecord.create({ patient: req.params.id });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN — Ajouter traitement
const addTreatment = async (req, res) => {
  try {
    const { description, tooth, cost, appointmentId } = req.body;

    let record = await MedicalRecord.findOne({ patient: req.params.id });
    if (!record) {
      record = await MedicalRecord.create({ patient: req.params.id });
    }

    record.treatments.push({
      description,
      tooth,
      cost,
      appointment: appointmentId,
    });
    record.updatedAt = Date.now();
    await record.save();

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN — Update infos patient
const updatePatient = async (req, res) => {
  try {
    const { name, phone, address, dateOfBirth, gender } = req.body;
    const patient = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, dateOfBirth, gender },
      { new: true }
    ).select('-password');

    if (!patient) return res.status(404).json({ message: 'Patient introuvable' });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllPatients, getPatientRecord, addTreatment, updatePatient };