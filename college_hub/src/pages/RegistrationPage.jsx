import React, { useState } from 'react';
import {
  Box, Button, Typography, Paper, TextField, MenuItem, Select, InputLabel, FormControl, Alert, Avatar, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { School, Work } from '@mui/icons-material';
import { registerUser } from '../api/Userapi';
import { useNavigate } from 'react-router-dom';

const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const years = ['1', '2', '3', '4'];
const branches = ['A', 'B', 'C'];
const courses = ['B.Tech', 'M.Tech', 'PhD'];

const RegistrationPage = () => {
  const [userType, setUserType] = useState('student');
  const [form, setForm] = useState({
    id: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    department: '',
    year: '',
    branch: '',
    course: '',
    mobile: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleUserType = (_, newType) => {
    if (newType) setUserType(newType);
    setForm({
      id: '',
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      department: '',
      year: '',
      branch: '',
      course: '',
      mobile: ''
    });
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.id.match(/^[a-zA-Z0-9]{4,}$/)) return `${userType === 'student' ? 'Student' : 'Staff'} ID must be at least 4 alphanumeric characters.`;
    if (!form.username.match(/^[a-zA-Z0-9_]{4,}$/)) return 'Username must be at least 4 characters, letters/numbers/underscores only.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) return 'Invalid email address.';
    if (!form.department) return 'Department is required.';
    if (userType === 'student') {
      if (!form.year) return 'Year is required.';
      if (!form.branch) return 'Branch is required.';
      if (!form.course) return 'Course is required.';
    }
    if (!form.mobile.match(/^[6-9]\d{9}$/)) return 'Mobile must be a valid 10-digit number starting with 6-9.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      setSuccess('');
      return;
    }
    try {
      const payload = {
        userType,
        id: form.id,
        username: form.username,
        password: form.password,
        email: form.email,
        department: form.department,
        year: userType === 'student' ? form.year : undefined,
        branch: userType === 'student' ? form.branch : undefined,
        course: userType === 'student' ? form.course : undefined,
        mobile: form.mobile
      };
      console.log('Sending registration payload:', payload);
      const response = await registerUser(payload);
      console.log('Registration response:', response);
      
      if (response.data && response.data.message === 'Registration successful.') {
        setSuccess('Registration successful!');
        setError('');
        setTimeout(() => navigate('/'), 2000); // Redirect to login after 2 seconds
      } else {
        setError(response.data?.message || 'Registration failed.');
        setSuccess('');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Server error. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: userType === 'student' ? '#2e7d32' : '#1976d2', width: 56, height: 56, mb: 1 }}>
            {userType === 'student' ? <School fontSize="large" /> : <Work fontSize="large" />}
          </Avatar>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {userType === 'student' ? 'Student' : 'Staff'} Registration
          </Typography>
          <ToggleButtonGroup
            value={userType}
            exclusive
            onChange={handleUserType}
            sx={{ mb: 2 }}
            size="small"
          >
            <ToggleButton value="student" aria-label="student">Student</ToggleButton>
            <ToggleButton value="staff" aria-label="staff">Staff</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={userType === 'student' ? "Student ID" : "Staff ID"}
            name="id"
            value={form.id}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 20 }}
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 20 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ minLength: 6, maxLength: 20 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ minLength: 6, maxLength: 20 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
            type="email"
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={form.department}
              label="Department"
              onChange={handleChange}
            >
              {departments.map(dep => <MenuItem key={dep} value={dep}>{dep}</MenuItem>)}
            </Select>
          </FormControl>
          {userType === 'student' && (
            <>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Year</InputLabel>
                <Select
                  name="year"
                  value={form.year}
                  label="Year"
                  onChange={handleChange}
                >
                  {years.map(yr => <MenuItem key={yr} value={yr}>{yr}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Branch</InputLabel>
                <Select
                  name="branch"
                  value={form.branch}
                  label="Branch"
                  onChange={handleChange}
                >
                  {branches.map(br => <MenuItem key={br} value={br}>{br}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Course</InputLabel>
                <Select
                  name="course"
                  value={form.course}
                  label="Course"
                  onChange={handleChange}
                >
                  {courses.map(cr => <MenuItem key={cr} value={cr}>{cr}</MenuItem>)}
                </Select>
              </FormControl>
            </>
          )}
          <TextField
            fullWidth
            label="Mobile"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
            type="tel"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, py: 1.5 }}
          >
            Register
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ mt: 1 }}
            onClick={() => navigate('/')}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegistrationPage;