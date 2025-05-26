import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { getProfile, updateProfile } from '../api/Userapi';
import EditProfileForm from '../components/EditProfileForm';
import '../styles/Profile.css';

const ProfilePage = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();

  const fetchProfile = async () => {
    if (userId) {
      try {
        const res = await getProfile(userId);
        setProfile(res.data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to load profile',
          severity: 'error'
        });
        setProfile(null);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      await updateProfile(userId, updatedData);
      await fetchProfile(); // Refresh profile data
      setIsEditOpen(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!profile) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '80vh' 
    }}>
      <Typography variant="h6">Loading profile...</Typography>
    </Box>
  );

  const InfoCard = ({ icon, title, value }) => (
    <Card sx={{ 
      height: '100%',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      minWidth: '240px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        textAlign: 'center',
        p: 3,
        width: '100%'
      }}>
        {React.cloneElement(icon, { 
          sx: { 
            fontSize: 40, 
            color: theme.palette.primary.main,
            mb: 2
          } 
        })}
        <Typography 
          variant="subtitle2" 
          color="text.secondary" 
          gutterBottom 
          sx={{ fontSize: '0.875rem', mb: 1 }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'medium',
            wordBreak: 'break-word',
            maxWidth: '100%'
          }}
        >
          {value || 'Not specified'}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box className="profile-container">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        {/* Header Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            position: 'relative'
          }}
        >
          <Tooltip title="Edit Profile" placement="left">
            <IconButton 
              onClick={handleEditClick}
              sx={{ 
                position: 'absolute', 
                right: 20, 
                top: 20,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: 'center',
            gap: 4
          }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120,
                bgcolor: theme.palette.primary.main,
                fontSize: '3rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              {profile.name?.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {profile.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {profile.userType === 'student' ? 'Student' : 'Staff'} • {profile.department}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                {profile.year && (
                  <Typography variant="body1" color="text.secondary">
                    Year {profile.year}
                  </Typography>
                )}
                {profile.branch && (
                  <Typography variant="body1" color="text.secondary">
                    Branch {profile.branch}
                  </Typography>
                )}
                {profile.course && (
                  <Typography variant="body1" color="text.secondary">
                    {profile.course}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Info Cards */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            justifyContent: 'center',
            maxWidth: '1200px',
            mx: 'auto',
            px: 2
          }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard 
              icon={<EmailIcon />}
              title="Email"
              value={profile.email}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard 
              icon={<PhoneIcon />}
              title="Mobile"
              value={profile.mobile}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard 
              icon={<SchoolIcon />}
              title="Department"
              value={profile.department}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoCard 
              icon={<BusinessIcon />}
              title="ID"
              value={profile.id}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Profile Dialog */}
      <EditProfileForm
        open={isEditOpen}
        onClose={handleEditClose}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;