const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require('../controllers/appointment.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.post('/', protect, createAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/', protect, adminOnly, getAllAppointments);
router.patch('/:id/status', protect, adminOnly, updateAppointmentStatus);
router.patch('/:id/cancel', protect, cancelAppointment);

module.exports = router;