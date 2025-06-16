// server/controllers/appointments.js
const Appointment = require('../models/Appointment');
const { validationResult } = require('express-validator');

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.userId })
      .sort({ startTime: 1 });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

exports.createAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, startTime, endTime, location } = req.body;

  try {
    // Check for overlapping appointments
    const overlapping = await Appointment.findOne({
      user: req.userId,
      $or: [
        { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
      ]
    });

    if (overlapping) {
      return res.status(400).json({ message: 'Appointment overlaps with existing one' });
    }

    const appointment = new Appointment({
      title,
      description,
      startTime,
      endTime,
      location,
      user: req.userId
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, startTime, endTime, location } = req.body;

  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, description, startTime, endTime, location },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findOneAndDelete({ _id: id, user: req.userId });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    next(err);
  }
};