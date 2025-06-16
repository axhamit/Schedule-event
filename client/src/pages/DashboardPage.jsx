// client/src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { Box, Typography, Button, Container, Paper, Toolbar, AppBar, LinearProgress, Alert, Chip, Grid, Avatar, Divider, Badge } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AppointmentModal from '../components/AppointmentModal/AppointmentModal';
import { useNavigate } from 'react-router-dom';
import { Add, ExitToApp, Notifications, Event, CheckCircle, CalendarToday } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const localizer = momentLocalizer(moment);

// Custom theme with modern colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a6bff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6b6b',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { appointments, isLoading, error } = useAppointments();
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();

  const handleSelectEvent = (event) => {
    setSelectedAppointment(event);
    setOpenModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Categorize appointments
  const now = new Date();
  const upcomingAppointments = appointments.filter(appt => new Date(appt.startTime) > now).slice(0, 3);
  const completedAppointments = appointments.filter(appt => new Date(appt.endTime) < now).slice(0, 3);

  const events = appointments.map(appt => ({
    id: appt._id,
    title: appt.title,
    start: new Date(appt.startTime),
    end: new Date(appt.endTime),
    description: appt.description,
    location: appt.location
  }));

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0} sx={{ 
          backgroundColor: 'primary.main', 
          color: 'primary.contrastText',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
        }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarToday fontSize="large" />
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Schedule-event
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge badgeContent={upcomingAppointments.length} color="secondary">
                <Notifications />
              </Badge>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>{user?.username.charAt(0).toUpperCase()}</Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
          {/* Header with stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <Event />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total Appointments</Typography>
                  <Typography variant="h5" fontWeight={700}>{appointments.length}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <Event />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Upcoming</Typography>
                  <Typography variant="h5" fontWeight={700}>{upcomingAppointments.length}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.light' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Completed</Typography>
                  <Typography variant="h5" fontWeight={700}>{completedAppointments.length}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenModal(true)}
                  sx={{ height: '100%' }}
                >
                  New Appointment
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {isLoading && (
            <Box sx={{ width: '100%', mb: 3 }}>
              <LinearProgress />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3, height: '600px' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Your Schedule</Typography>
                <Divider sx={{ mb: 3 }} />
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 'calc(100% - 60px)' }}
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: '#4a6bff',
                      borderRadius: '8px',
                      border: 'none',
                      color: 'white',
                      padding: '4px 8px',
                      fontSize: '0.875rem',
                    },
                  })}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Events</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map(appt => (
                      <Box key={appt._id} sx={{ mb: 2, p: 2, bgcolor: 'primary.light', borderRadius: '8px' }}>
                        <Typography fontWeight={600}>{appt.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {moment(appt.startTime).format('MMM D, h:mm A')}
                        </Typography>
                        <Chip 
                          label={appt.location} 
                          size="small" 
                          sx={{ mt: 1, bgcolor: 'white' }} 
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No upcoming events
                    </Typography>
                  )}
                </Paper>
                
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Recent Completed</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {completedAppointments.length > 0 ? (
                    completedAppointments.map(appt => (
                      <Box key={appt._id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                        <Typography fontWeight={600}>{appt.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Completed on {moment(appt.endTime).format('MMM D')}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No completed events
                    </Typography>
                  )}
                </Paper>
                
                <Button
                  variant="outlined"
                  startIcon={<ExitToApp />}
                  onClick={handleLogout}
                  color="secondary"
                  fullWidth
                >
                  Logout
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <AppointmentModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
        />
      </Box>
    </ThemeProvider>
  );
};

export default DashboardPage;