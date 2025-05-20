
import * as React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as UserIcon
} from '@mui/icons-material';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      <Toolbar>
        {/* Sidebar toggle button (for mobile) */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo/Branding */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            color: '#1976d2',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box 
            component="span" 
            sx={{ 
              display: 'inline-block',
              mr: 1,
              fontSize: '1.5rem'
            }}
          >
            KOLLEGE
          </Box>
        </Typography>

        {/* Notification Icon */}
        <IconButton
          size="large"
          aria-label="show notifications"
          color="inherit"
          sx={{ mr: 1 }}
        >
          <NotificationsIcon />
        </IconButton>

        {/* User Profile */}
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
            <UserIcon fontSize="small" />
          </Avatar>
        </IconButton>

        {/* User Dropdown Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;