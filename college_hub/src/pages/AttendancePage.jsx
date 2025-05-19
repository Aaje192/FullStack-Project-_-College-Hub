import { Box, Typography, Paper } from '@mui/material';

const AttendancePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Attendance Page
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Page-specific content */}
      </Paper>
    </Box>
  );
};

export default AttendancePage;