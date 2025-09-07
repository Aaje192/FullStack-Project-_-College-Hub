import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Box } from '@mui/material';
import {
  Grade as MarksIcon,
  CheckCircle as AttendanceIcon,
  Schedule as TimetableIcon,
  Person as ProfileIcon,
  Task as TasksIcon,
  Forum as ChatIcon,
  Notes as NotesIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ onLogout }) => {
  const { mode } = useTheme();

  const menuItems = [
    { text: 'Marks', icon: <MarksIcon />, path: '/marks', desc: 'View your academic marks' },
    { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance', desc: 'View and manage attendance' },
    { text: 'Timetable', icon: <TimetableIcon />, path: '/timetable', desc: 'Check your schedule' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile', desc: 'Manage your profile' },
    { text: 'Tasks', icon: <TasksIcon />, path: '/tasks', desc: 'Manage your tasks' },
    { text: 'Chat Forum', icon: <ChatIcon />, path: '/chat', desc: 'Join discussion forums' },
    { text: 'Notes', icon: <NotesIcon />, path: '/notes', desc: 'Access study materials' }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          color: '#2c3e50',
          borderRight: '1px solid #e1e8ed',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold', 
          letterSpacing: '1px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          KOLLEGE HUB
        </Typography>
        <Typography variant="caption" sx={{ 
          opacity: 0.9,
          fontWeight: 300
        }}>
          Student Portal
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            sx={{
              '&:hover': { 
                backgroundColor: '#f8f9fa',
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease-in-out'
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              py: 2,
              my: 0.5,
              borderRadius: 2,
              color: '#2c3e50',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <ListItemIcon sx={{ 
                minWidth: '40px', 
                color: '#667eea'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: 600, 
                  color: '#2c3e50',
                  fontSize: '0.95rem'
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ 
              pl: 5, 
              color: '#7f8c8d',
              fontStyle: 'italic',
              fontSize: '0.75rem',
              mt: 0.5
            }}>
              {item.desc}
            </Typography>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: 'auto', borderColor: '#e1e8ed' }} />
      
      <ListItem 
        button 
        onClick={onLogout}
        sx={{
          '&:hover': { 
            backgroundColor: '#ffebee',
            transform: 'translateX(4px)',
            transition: 'all 0.2s ease-in-out'
          },
          py: 2,
          mx: 1,
          my: 1,
          borderRadius: 2,
          color: '#e74c3c',
        }}
      >
        <ListItemIcon sx={{ minWidth: '40px', color: '#e74c3c' }}>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText 
          primary="Logout" 
          primaryTypographyProps={{ 
            color: '#e74c3c',
            fontWeight: 600
          }}
        />
      </ListItem>
    </Drawer>
  );
};

export default Sidebar;