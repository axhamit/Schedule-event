// client/src/components/AppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './AppointmentModal.module.css';


import { useAppointments } from '../../context/AppointmentContext';

const AppointmentModal = ({ open, onClose, appointment }) => {
  const { createAppointment, updateAppointment, deleteAppointment } = useAppointments();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title || '');
      setDescription(appointment.description || '');
      setStartTime(appointment.startTime ? appointment.startTime.slice(0, 16) : '');
      setEndTime(appointment.endTime ? appointment.endTime.slice(0, 16) : '');
      setLocation(appointment.location || '');
    } else {
      resetForm();
    }
  }, [appointment]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const appointmentData = {
      title,
      description,
      startTime,
      endTime,
      location
    };

    const result = appointment
      ? await updateAppointment(appointment.id, appointmentData)
      : await createAppointment(appointmentData);

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  const handleDelete = async () => {
    if (appointment) {
      const result = await deleteAppointment(appointment.id);
      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    }
  };

  if (!open) return null;

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {appointment ? 'Edit Appointment' : 'Create New Appointment'}
        </h2>
  
        {error && <p className={styles.error}>{error}</p>}
  
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="text"
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
            type="text"
            placeholder="Location or Meeting Link"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
  
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
              {appointment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default AppointmentModal;
