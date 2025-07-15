const Appointment = require("../models/Appointment");
const { validationResult } = require("express-validator");

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.userId }).sort({
      startTime: 1
    });
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

  const {
    title,
    description,
    startTime,
    endTime,
    location,
    isRecurring,
    frequency,
    repeatUntil
  } = req.body;

  try {
    const overlapping = await Appointment.findOne({
      user: req.userId,
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) }
        }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ message: "Appointment overlaps with existing one" });
    }

    const appointment = new Appointment({
      title,
      description,
      startTime,
      endTime,
      location,
      user: req.userId,
      isRecurring,
      frequency: frequency || null,
      repeatUntil: isRecurring ? new Date(repeatUntil) : null
    });

    await appointment.save();

    if (isRecurring && frequency === "daily" && repeatUntil) {
      let nextStart = new Date(startTime);
      let nextEnd = new Date(endTime);

      while (nextStart < new Date(repeatUntil)) {
        nextStart.setDate(nextStart.getDate() + 1);
        nextEnd.setDate(nextEnd.getDate() + 1);

        if (nextStart > new Date(repeatUntil)) break;

        const future = new Appointment({
          title,
          description,
          startTime: new Date(nextStart),
          endTime: new Date(nextEnd),
          location,
          user: req.userId,
          isRecurring,
          frequency,
          repeatUntil: new Date(repeatUntil)
        });
        await future.save();
      }
    }

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
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: id,
      user: req.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    next(err);
  }
};
