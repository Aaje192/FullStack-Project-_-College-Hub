import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';
import '../App.css';

const DashboardLayout = ({ onLogout }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onLogout={onLogout} />
      <Box component="main" sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Navbar onLogout={onLogout} />
        <div className="app-content">
          <Outlet />
        </div>
      </Box>
    </Box>
  );
};

export default DashboardLayout;