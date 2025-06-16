// server/routes/appointments.js
const express = require('express');
const { check } = require('express-validator');
const appointmentController = require('../controllers/appointments');

const router = express.Router();

router.get('/', appointmentController.getAppointments);

router.post('/', [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('startTime').isISO8601().withMessage('Invalid start time'),
  check('endTime').isISO8601().withMessage('Invalid end time'),
  check('endTime').custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.startTime)) {
      throw new Error('End time must be after start time');
    }
    return true;
  })
], appointmentController.createAppointment);

router.put('/:id', [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('startTime').isISO8601().withMessage('Invalid start time'),
  check('endTime').isISO8601().withMessage('Invalid end time'),
  check('endTime').custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.startTime)) {
      throw new Error('End time must be after start time');
    }
    return true;
  })
], appointmentController.updateAppointment);

router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;