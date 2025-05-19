import { useState } from 'react';
import { 
  TextField, Button, Box, Typography, Avatar, 
  IconButton, InputAdornment 
} from '@mui/material';
import { 
  ArrowBack as BackIcon,
  Visibility,
  VisibilityOff,
  Work as StaffIcon
} from '@mui/icons-material';

const StaffLoginForm = ({ onBack, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication logic here
    onSuccess();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mb: 1 }}>
          <StaffIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5">Staff Login</Typography>
      </Box>

      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
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
        sx={{ mt: 3, mb: 2, py: 1.5 }}
      >
        Login
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button 
          color="primary" 
          size="small" 
          href="/register/staff"
          sx={{ textTransform: 'none' }}
        >
          Register as Staff
        </Button>
      </Box>
    </Box>
  );
};

export default StaffLoginForm;