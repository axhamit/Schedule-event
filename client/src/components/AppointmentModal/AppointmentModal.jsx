import React, { useState, useEffect } from 'react';
import styles from './AppointmentModal.module.css';
import { useAppointments } from '../../context/AppointmentContext';

const AppointmentModal = ({ open, onClose, appointment }) => {
  const { createAppointment, updateAppointment, deleteAppointment } = useAppointments();

  const [title, setTitle] = useState("FU Meeting");
  const [description, setDescription] = useState("Daily follow-up meeting");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);
  const [frequency, setFrequency] = useState("daily");
  const [repeatUntil, setRepeatUntil] = useState("");

  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title || '');
      setDescription(appointment.description || '');
      setStartTime(appointment.startTime ? appointment.startTime.slice(0,16) : '');
      setEndTime(appointment.endTime ? appointment.endTime.slice(0,16) : '');
      setLocation(appointment.location || '');
      setIsRecurring(appointment.isRecurring || false);
      setFrequency(appointment.frequency || "daily");
      setRepeatUntil(appointment.repeatUntil ? appointment.repeatUntil.slice(0,10) : "");
    } else {
      resetForm();
    }
  }, [appointment]);

  const resetForm = () => {
    setTitle("FU Meeting");
    setDescription("Daily follow-up meeting");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setIsRecurring(true);
    setFrequency("daily");
    setRepeatUntil("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = {
      title,
      description,
      startTime,
      endTime,
      location,
      isRecurring,
      frequency: isRecurring ? frequency : null,
      repeatUntil: isRecurring ? repeatUntil : null
    };

    const result = appointment
      ? await updateAppointment(appointment._id, data)
      : await createAppointment(data);

    if (result.success) {
      onClose();
    } else {
      setError(result.message || "Something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (appointment) {
      const result = await deleteAppointment(appointment._id);
      if (result.success) {
        onClose();
      } else {
        setError(result.message || "Delete failed.");
      }
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {appointment ? "Edit Appointment" : "Create New Appointment"}
        </h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className={styles.textarea}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className={styles.datetime}
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <input
            className={styles.datetime}
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
          <input
            className={styles.input}
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <label>
            Recurring
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
          </label>
          {isRecurring && (
            <>
              <label>Repeat Until (3 months)</label>
              <input
                type="date"
                value={repeatUntil}
                onChange={(e) => setRepeatUntil(e.target.value)}
                required
              />
              <label>Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="daily">Daily</option>
              </select>
            </>
          )}
          <div className={styles.actions}>
            {appointment && (
              <button
                type="button"
                className={`${styles.button} ${styles.danger}`}
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              className={`${styles.button} ${styles.secondary}`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.primary}`}
            >
              {appointment ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
