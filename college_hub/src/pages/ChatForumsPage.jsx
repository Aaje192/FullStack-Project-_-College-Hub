import { Box, Typography, Paper } from '@mui/material';

const ChatForumsPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Chat Forums
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Page-specific content */}
      </Paper>
    </Box>
  );
};

export default ChatForumsPage;