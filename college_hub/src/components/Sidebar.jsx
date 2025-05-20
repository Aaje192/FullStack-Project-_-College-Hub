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
    { text: 'Chat Forums', icon: <ChatIcon />, path: '/chat', desc: 'Join discussion forums' },
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
          backgroundColor: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          borderRight: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #23272f',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--sidebar-active)' }}>
          KOLLEGE
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            sx={{
              '&:hover': { backgroundColor: mode === 'light' ? '#e3f2fd' : '#263245' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              py: 2,
              color: 'var(--sidebar-text)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon sx={{ minWidth: '40px', color: 'var(--sidebar-text)' }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 'medium', color: 'var(--sidebar-text)' }}
              />
            </Box>
            <Typography variant="body2" sx={{ 
              pl: 6, 
              color: mode === 'light' ? 'text.secondary' : '#b0bec5',
              fontStyle: 'italic',
              fontSize: '0.8rem'
            }}>
              {item.desc}
            </Typography>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: 'auto' }} />
      
      <ListItem 
        button 
        onClick={onLogout}
        sx={{
          '&:hover': { backgroundColor: mode === 'light' ? '#ffebee' : '#3a2323' },
          py: 2,
          color: 'var(--sidebar-text)',
        }}
      >
        <ListItemIcon sx={{ minWidth: '40px', color: 'var(--sidebar-text)' }}>
          <LogoutIcon color="error" />
        </ListItemIcon>
        <ListItemText 
          primary="Logout" 
          primaryTypographyProps={{ color: 'error' }}
        />
      </ListItem>
    </Drawer>
  );
};

export default Sidebar;