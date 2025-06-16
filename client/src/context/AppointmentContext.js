// client/src/context/AppointmentContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { appointmentsAPI } from '../api/api';
import { useAuth } from './AuthContext';
import dayjs from 'dayjs';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await appointmentsAPI.getAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const createAppointment = async (appointmentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await appointmentsAPI.createAppointment(appointmentData);
      setAppointments(prev => [...prev, response.data]);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment');
      return { success: false, message: err.response?.data?.message || 'Failed to create appointment' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointment = async (id, appointmentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await appointmentsAPI.updateAppointment(id, appointmentData);
      setAppointments(prev => 
        prev.map(appt => appt._id === id ? response.data : appt)
      );
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appointment');
      return { success: false, message: err.response?.data?.message || 'Failed to update appointment' };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await appointmentsAPI.deleteAppointment(id);
      setAppointments(prev => prev.filter(appt => appt._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete appointment');
      return { success: false, message: err.response?.data?.message || 'Failed to delete appointment' };
    } finally {
      setIsLoading(false);
    }
  };

  const getAppointmentsForDay = (date) => {
    return appointments.filter(appt => 
      dayjs(appt.startTime).isSame(date, 'day')
    );
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  return (
    <AppointmentContext.Provider value={{
      appointments,
      isLoading,
      error,
      createAppointment,
      updateAppointment,
      deleteAppointment,
      getAppointmentsForDay,
      fetchAppointments
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => useContext(AppointmentContext);