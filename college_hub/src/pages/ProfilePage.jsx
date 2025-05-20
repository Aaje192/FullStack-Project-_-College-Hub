import React from 'react';
import { Box, Typography, Paper, Avatar, Grid, Divider } from '@mui/material';

const mockProfile = {
  name: 'John Doe',
  id: 'STU123456',
  email: 'john.doe@example.com',
  mobile: '+91 9876543210',
  year: '3rd Year',
  department: 'Computer Science',
  semester: '6',
  branch: 'Software Engineering',
};

const ProfilePage = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Profile Page
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
            {mockProfile.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {mockProfile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mockProfile.branch}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography variant="subtitle2" color="text.secondary">Student ID:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{mockProfile.id}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{mockProfile.email}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle2" color="text.secondary">Mobile Number:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{mockProfile.mobile}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle2" color="text.secondary">Year:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{mockProfile.year}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle2" color="text.secondary">Department:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{mockProfile.department}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle2" color="text.secondary">Semester:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{mockProfile.semester}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfilePage;