import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, IconButton, Avatar } from '@mui/material';
import { School, Work, ArrowBack, AccountBalance } from '@mui/icons-material';
import StaffLoginForm from '../components/StaffLoginForm';
import StudentLoginForm from '../components/StudentLoginForm';

const LoginPage = ({ onLogin }) => {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const handleUserTypeSelection = (type) => setUserType(type);
  const handleGoBack = () => setUserType(null);
  const handleSuccessfulLogin = (userId) => {
    onLogin(userId);
    navigate('/marks');
  };

  const renderUserSelection = () => (
    <Paper elevation={3} sx={{ p: 4, width: 400, textAlign: 'center', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Select User Type
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Work />}
          onClick={() => handleUserTypeSelection('staff')}
          sx={{ py: 1.5, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
        >
          Staff Login
        </Button>
        <Button
          variant="contained"
          startIcon={<School />}
          onClick={() => handleUserTypeSelection('student')}
          sx={{ py: 1.5, backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
        >
          Student Login
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 3 }}>
        <Button 
          color="primary" 
          size="small" 
          onClick={() => navigate('/register')}
          sx={{ textTransform: 'none' }}
        >
          Click to Register
        </Button>
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Sample login: user / 123
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, color: '#1976d2' }}>
        <AccountBalance sx={{ fontSize: 40, mr: 1.5 }} />
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>KOLLEGE</Typography>
      </Box>
      {userType ? (
        <Paper elevation={3} sx={{ p: 4, width: 400, position: 'relative', borderRadius: 2 }}>
          <IconButton onClick={handleGoBack} sx={{ position: 'absolute', left: 10, top: 10 }}><ArrowBack /></IconButton>
          {userType === 'staff' ? (
            <StaffLoginForm onSuccess={handleSuccessfulLogin} />
          ) : (
            <StudentLoginForm onSuccess={handleSuccessfulLogin} />
          )}
        </Paper>
      ) : renderUserSelection()}
      <Box>
        <Button
          fullWidth
          variant="text"
          sx={{ mt: 1 }}
          onClick={() => navigate('/register')}
        >
          Don't have an account? Register
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;