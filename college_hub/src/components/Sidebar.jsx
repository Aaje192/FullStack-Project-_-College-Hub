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

const Sidebar = ({ onLogout }) => {
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
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
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
              '&:hover': { backgroundColor: '#e3f2fd' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              py: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </Box>
            <Typography variant="body2" sx={{ 
              pl: 6, 
              color: 'text.secondary',
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
          '&:hover': { backgroundColor: '#ffebee' },
          py: 2,
        }}
      >
        <ListItemIcon sx={{ minWidth: '40px' }}><LogoutIcon color="error" /></ListItemIcon>
        <ListItemText 
          primary="Logout" 
          primaryTypographyProps={{ color: 'error' }}
        />
      </ListItem>
    </Drawer>
  );
};

export default Sidebar;