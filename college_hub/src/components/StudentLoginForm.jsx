import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography, Avatar,
  IconButton, InputAdornment, Alert, Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School
} from '@mui/icons-material';
import { loginUser } from '../api/Userapi';
import ForgotPasswordForm from './ForgotPasswordForm';

const StudentLoginForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Temporary fake credential check
    if (credentials.username === 'user' && credentials.password === '123') {
      onSuccess('tempuser1'); // Pass a fake user id
      return;
    }
    // Otherwise, call backend as usual
    try {
      const res = await loginUser(credentials);
      if (res.data && res.data.message === 'Login successful.') {
        onSuccess(res.data.id);
      } else {
        setError(res.data.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onCancel={() => setShowForgotPassword(false)} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, minWidth: 350, maxWidth: 400, width: '100%' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 64, height: 64, mb: 1, boxShadow: 2 }}>
              <School fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="#1976d2">Student Login</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            required
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            required
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2, mb: 2, py: 1.5, fontWeight: 600, fontSize: '1rem', bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => setShowForgotPassword(true)}
            sx={{ mb: 2, color: '#1976d2', fontWeight: 500 }}
          >
            Forgot Password?
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
            Sample: <b>user</b> / <b>123</b>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentLoginForm;