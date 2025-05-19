import { Box, Typography, Paper } from '@mui/material';

const ProfilePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        
        Profile Page
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Page-specific content */}
      </Paper>
    </Box>
  );
};

export default ProfilePage;