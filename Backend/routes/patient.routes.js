const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientRecord,
  addTreatment,
  updatePatient,
} = require('../controllers/patient.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.get('/', protect, adminOnly, getAllPatients);
router.get('/:id/record', protect, adminOnly, getPatientRecord);
router.post('/:id/treatment', protect, adminOnly, addTreatment);
router.patch('/:id', protect, adminOnly, updatePatient);

module.exports = router;