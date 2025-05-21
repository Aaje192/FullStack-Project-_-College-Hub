import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, Grid, Divider } from '@mui/material';
import { getProfile } from '../api/Userapi';

const ProfilePage = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (userId) {
      getProfile(userId)
        .then(res => setProfile(res.data))
        .catch(() => setProfile(null));
    }
  }, [userId]);

  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Profile Page
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
            {profile.name?.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {profile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.branch || profile.course || profile.userType}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography variant="subtitle2" color="text.secondary">ID:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{profile.id}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{profile.email}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle2" color="text.secondary">Mobile Number:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{profile.mobile}</Typography>
          </Grid>
          {profile.year && (
            <>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="text.secondary">Year:</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>{profile.year}</Typography>
              </Grid>
            </>
          )}
          <Grid item xs={5}>
            <Typography variant="subtitle2" color="text.secondary">Department:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography>{profile.department}</Typography>
          </Grid>
          {profile.branch && (
            <>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="text.secondary">Branch:</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>{profile.branch}</Typography>
              </Grid>
            </>
          )}
          {profile.course && (
            <>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="text.secondary">Course:</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>{profile.course}</Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfilePage;