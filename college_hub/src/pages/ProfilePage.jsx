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
  Snackbar,
  Button,
  Chip
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { getProfile, updateProfile } from '../api/Userapi';
import EditProfileForm from '../components/EditProfileForm';

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
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: '#2c3e50',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <PersonIcon sx={{ fontSize: '2rem', color: '#667eea' }} />
          Student Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your personal information and academic details
        </Typography>
      </Box>

      {/* Profile Header Card */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        position: 'relative'
      }}>
        <Button
          onClick={handleEditClick}
          variant="contained"
          startIcon={<EditIcon />}
          sx={{ 
            position: 'absolute', 
            right: 20, 
            top: 20,
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)'
            }
          }}
        >
          Edit Profile
        </Button>

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
              bgcolor: 'rgba(255,255,255,0.2)',
              fontSize: '3rem',
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: '4px solid rgba(255,255,255,0.3)'
            }}
          >
            {profile.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {profile.username}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Chip 
                label={profile.userType === 'student' ? 'Student' : 'Staff'} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
              <Chip 
                label={profile.department} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
              {profile.year && (
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Year {profile.year}
                </Typography>
              )}
              {profile.branch && (
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {profile.branch}
                </Typography>
              )}
              {profile.course && (
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {profile.course}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Info Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#667eea', mr: 2 }}>
                  <EmailIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  Contact Information
                </Typography>
              </Box>
              <Box sx={{ ml: 7 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {profile.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Mobile Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.mobile}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#4CAF50', mr: 2 }}>
                  <SchoolIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  Academic Details
                </Typography>
              </Box>
              <Box sx={{ ml: 7 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Student ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  {profile.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Department
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.department}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {(profile.year || profile.branch || profile.course) && (
          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#FF9800', mr: 2 }}>
                    <BadgeIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    Course Information
                  </Typography>
                </Box>
                <Grid container spacing={3} sx={{ ml: 7 }}>
                  {profile.year && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Academic Year
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Year {profile.year}
                      </Typography>
                    </Grid>
                  )}
                  {profile.branch && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Branch
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profile.branch}
                      </Typography>
                    </Grid>
                  )}
                  {profile.course && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Course
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profile.course}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

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