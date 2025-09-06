import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';

const Dashboard = ({ onLogout }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: '#f5f7fa'
    }}>
      <Sidebar onLogout={onLogout} />
      <Box component="main" sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <Navbar onLogout={onLogout} />
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          flexGrow: 1,
          mt: 8, // Account for navbar height
          bgcolor: '#f5f7fa'
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;