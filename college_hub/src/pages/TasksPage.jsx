import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  Divider,
  Stack,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Avatar,
  LinearProgress
} from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  Assignment,
  Add,
  Edit,
  Delete,
  Schedule,
  CheckCircle,
  AccessTime,
  Warning
} from '@mui/icons-material';
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../api/Taskapi";

const TasksPage = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDateTime: null,
    deadline: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setSeverity(type);
    setShowSnackbar(true);
  };

  const fetchTasks = async () => {
    try {
      if (!userId) {
        console.log('No userId provided');
        return;
      }
      const res = await getTasks(userId);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      if (err.response?.status === 401) {
        // Handle unauthorized error specifically
        showMessage("Session expired. Please log in again.", "error");
      } else {
        showMessage("Failed to fetch tasks", "error");
      }
      setTasks([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (field) => (newValue) => {
    setFormData({ ...formData, [field]: newValue ? newValue.toISOString() : null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDateTime || !formData.deadline) {
      showMessage("Please select both start time and deadline", "error");
      return;
    }

    try {
      if (!userId) {
        showMessage("User session expired. Please log in again.", "error");
        return;
      }

      if (editingId) {
        await updateTask(editingId, formData);
        showMessage("Task updated successfully");
      } else {
        await addTask({ ...formData, studentId: userId });
        showMessage("Task added successfully");
      }
      await fetchTasks();
      setFormData({
        title: "",
        description: "",
        startDateTime: null,
        deadline: null,
      });
      setEditingId(null);
    } catch (err) {
      console.error('Error saving task:', err);
      if (err.response?.status === 401) {
        showMessage("Session expired. Please log in again.", "error");
      } else {
        showMessage(err.response?.data?.message || "Failed to save task", "error");
      }
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      startDateTime: task.startDateTime,
      deadline: task.deadline,
    });
    setEditingId(task._id);
  };

  const handleDelete = async (id) => {
    try {
      if (!userId) {
        showMessage("User session expired. Please log in again.", "error");
        return;
      }
      await deleteTask(id);
      showMessage("Task deleted successfully");
      await fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      if (err.response?.status === 401) {
        showMessage("Session expired. Please log in again.", "error");
      } else {
        showMessage("Failed to delete task", "error");
      }
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const overdueTasks = tasks.filter(task => 
    dayjs(task.deadline).isBefore(dayjs()) && task.status !== 'completed'
  ).length;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <Assignment sx={{ fontSize: '2rem', color: '#667eea' }} />
            Task Manager
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Organize and track your academic tasks and assignments
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {tasks.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Tasks
                    </Typography>
                  </Box>
                  <Assignment sx={{ fontSize: '2.5rem', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {completedTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Completed
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: '2.5rem', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {pendingTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Pending
                    </Typography>
                  </Box>
                  <AccessTime sx={{ fontSize: '2.5rem', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(245, 87, 108, 0.3)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {overdueTasks}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Overdue
                    </Typography>
                  </Box>
                  <Warning sx={{ fontSize: '2.5rem', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Task Form */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add sx={{ color: '#667eea' }} />
            {editingId ? 'Edit Task' : 'Add New Task'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Task Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Start Date and Time"
                  value={formData.startDateTime ? dayjs(formData.startDateTime) : null}
                  onChange={handleDateChange('startDateTime')}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Deadline"
                  value={formData.deadline ? dayjs(formData.deadline) : null}
                  onChange={handleDateChange('deadline')}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true
                    }
                  }}
                  minDateTime={formData.startDateTime ? dayjs(formData.startDateTime) : null}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Button 
                    type="submit" 
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      }
                    }}
                  >
                    {editingId ? "Update Task" : "Add Task"}
                  </Button>
                  {editingId && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          title: "",
                          description: "",
                          startDateTime: null,
                          deadline: null,
                        });
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Tasks List */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
            Your Tasks
          </Typography>
          
          {tasks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Assignment sx={{ fontSize: '4rem', color: '#e0e0e0', mb: 2 }} />
              <Typography color="text.secondary" variant="h6">
                No tasks available
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Create your first task to get started!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {tasks.map((task) => {
                const isOverdue = dayjs(task.deadline).isBefore(dayjs()) && task.status !== 'completed';
                const daysUntilDeadline = dayjs(task.deadline).diff(dayjs(), 'days');
                
                return (
                  <Grid item xs={12} md={6} lg={4} key={task._id}>
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderLeft: isOverdue ? '4px solid #f5576c' : '4px solid #667eea',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s ease'
                      }
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {task.title}
                          </Typography>
                          {isOverdue && (
                            <Chip
                              label="Overdue"
                              color="error"
                              size="small"
                              icon={<Warning />}
                            />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {task.description}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Schedule sx={{ fontSize: '1rem', color: '#667eea' }} />
                            <Typography variant="caption">
                              Start: {dayjs(task.startDateTime).format('MMM D, h:mm A')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ fontSize: '1rem', color: isOverdue ? '#f5576c' : '#667eea' }} />
                            <Typography variant="caption" color={isOverdue ? 'error' : 'text.secondary'}>
                              Due: {dayjs(task.deadline).format('MMM D, h:mm A')}
                            </Typography>
                          </Box>
                          
                          {!isOverdue && daysUntilDeadline >= 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                              {daysUntilDeadline === 0 ? 'Due today' : `${daysUntilDeadline} days remaining`}
                            </Typography>
                          )}
                        </Box>
                        
                        <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(task)}
                            sx={{ color: '#667eea' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(task._id)}
                            sx={{ color: '#f5576c' }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>

        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
        >
          <Alert
            onClose={() => setShowSnackbar(false)}
            severity={severity}
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default TasksPage;