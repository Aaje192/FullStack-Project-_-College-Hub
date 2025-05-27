import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Avatar 
} from '@mui/material';
import { LockReset } from '@mui/icons-material';
import { forgotPassword } from '../api/Userapi';

const ForgotPasswordForm = ({ onCancel }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await forgotPassword(email);
      if (response.data && response.data.message) {
        setSuccess(response.data.message);
        setEmail('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mb: 1 }}>
          <LockReset fontSize="large" />
        </Avatar>
        <Typography variant="h5">Forgot Password</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        required
        disabled={isSubmitting}
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{ mt: 3, mb: 1, py: 1.5 }}
      >
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={onCancel}
        disabled={isSubmitting}
        sx={{ mt: 1 }}
      >
        Back to Login
      </Button>
    </Box>
  );
};

export default ForgotPasswordForm; 