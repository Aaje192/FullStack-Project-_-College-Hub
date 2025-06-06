import React, { useState } from 'react';
import { 
  TextField, Button, Box, Typography, Avatar, 
  IconButton, InputAdornment, Alert 
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
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mb: 1 }}>
          <School fontSize="large" />
        </Avatar>
        <Typography variant="h5">Student Login</Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        margin="normal"
        required
        value={credentials.username}
        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
      />
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        margin="normal"
        required
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
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
        sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
      >
        Login
      </Button>
      <Button
        fullWidth
        variant="text"
        onClick={() => setShowForgotPassword(true)}
        sx={{ mb: 2 }}
      >
        Forgot Password?
      </Button>
      <Typography variant="caption" color="text.secondary">
        Sample: user / 123
      </Typography>
    </Box>
  );
};

export default StudentLoginForm;