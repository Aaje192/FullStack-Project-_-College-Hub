import React from 'react';
import { useParams } from 'react-router-dom';
import ResetPasswordForm from '../components/ResetPasswordForm';
import { Box } from '@mui/material';

const ResetPasswordPage = () => {
  const { token } = useParams();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f5f5f5'
    }}>
      <ResetPasswordForm token={token} />
    </Box>
  );
};

export default ResetPasswordPage; 