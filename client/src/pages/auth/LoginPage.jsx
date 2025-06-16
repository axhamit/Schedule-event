// client/src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Link, 
  Paper, 
  Container,
  Divider,
  InputAdornment,
  IconButton,
  Fade
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  AccountCircle,
  Fingerprint
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom theme for login page
const loginTheme = createTheme({
  palette: {
    primary: {
      main: '#6C4AB6',
      light: '#8D72E1',
      dark: '#4D2C91',
    },
    secondary: {
      main: '#FF9B9B',
    },
    background: {
      default: '#F8F6F4',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#E0E0E0',
            },
            '&:hover fieldset': {
              borderColor: '#6C4AB6',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #6C4AB6 30%, #8D72E1 90%)',
        },
      },
    },
  },
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login({ email, password });
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={loginTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #F8F6F4 0%, #E8E3F8 100%)',
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <Fade in={true} timeout={800}>
            <Paper elevation={0} sx={{ 
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              boxShadow: '0 15px 30px rgba(108, 74, 182, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '8px',
                background: 'linear-gradient(90deg, #6C4AB6 0%, #FF9B9B 100%)',
              }
            }}>
              <Box textAlign="center" mb={4}>
                <AccountCircle sx={{ 
                  fontSize: 60, 
                  color: 'primary.main',
                  bgcolor: 'rgba(108, 74, 182, 0.1)',
                  borderRadius: '50%',
                  p: 1,
                }} />
                <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
                  Welcome Back
                </Typography>
                <Typography color="text.secondary">
                  Sign in to your account to continue
                </Typography>
              </Box>

              {error && (
                <Fade in={error !== ''}>
                  <Box
                    sx={{
                      backgroundColor: 'error.light',
                      color: 'error.dark',
                      p: 2,
                      borderRadius: 2,
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Fingerprint fontSize="small" />
                    <Typography variant="body2">{error}</Typography>
                  </Box>
                </Fade>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Link href="/forgot-password" underline="hover" variant="body2">
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2, py: 1.5 }}
                >
                  Sign In
                </Button>

                <Divider sx={{ my: 3 }}>or</Divider>

                <Box textAlign="center" mt={3}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link 
                      href="/signup" 
                      underline="hover" 
                      color="primary"
                      fontWeight={600}
                    >
                      Create one
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;