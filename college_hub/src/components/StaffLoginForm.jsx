import { useState } from 'react';
import { TextField, Button, Box, Typography, Avatar, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, Work } from '@mui/icons-material';

const StaffLoginForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication logic here
    console.log('Staff login attempt:', credentials);
    onSuccess();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mb: 1 }}><Work fontSize="large" /></Avatar>
        <Typography variant="h5">Staff Login</Typography>
      </Box>

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

      <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
        Login
      </Button>
    </Box>
  );
};

export default StaffLoginForm;