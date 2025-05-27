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
} from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                size="small"
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                size="small"
                multiline
                rows={2}
              />
              <DateTimePicker
                label="Start Date and Time"
                value={formData.startDateTime ? dayjs(formData.startDateTime) : null}
                onChange={handleDateChange('startDateTime')}
                slotProps={{
                  textField: {
                    size: "small",
                    required: true,
                    fullWidth: true
                  }
                }}
              />
              <DateTimePicker
                label="Deadline"
                value={formData.deadline ? dayjs(formData.deadline) : null}
                onChange={handleDateChange('deadline')}
                slotProps={{
                  textField: {
                    size: "small",
                    required: true,
                    fullWidth: true
                  }
                }}
                minDateTime={formData.startDateTime ? dayjs(formData.startDateTime) : null}
              />
              <Button type="submit" variant="contained" color="success">
                {editingId ? "Update Task" : "Add Task"}
              </Button>
              {editingId && (
                <Button
                  variant="outlined"
                  color="primary"
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
          </Box>
        </Paper>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mt: 4, mb: 2 }}>
          Tasks
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box>
            {tasks.length === 0 ? (
              <Typography>No tasks available.</Typography>
            ) : (
              <List sx={{ width: '100%' }}>
                {tasks.map((task) => (
                  <React.Fragment key={task._id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        borderRadius: 2,
                        mb: 1,
                        p: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.08)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="bold"
                        sx={{ 
                          color: 'primary.main',
                          fontSize: '1.1rem',
                          mb: 1
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.primary',
                          mb: 1,
                          lineHeight: 1.5
                        }}
                      >
                        {task.description}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 3, 
                        mb: 1,
                        color: 'text.secondary',
                        fontSize: '0.875rem'
                      }}>
                        <Typography variant="caption" display="block">
                          <strong>Start:</strong> {dayjs(task.startDateTime).format('MMM D, YYYY h:mm A')}
                        </Typography>
                        <Typography variant="caption" display="block">
                          <strong>Deadline:</strong> {dayjs(task.deadline).format('MMM D, YYYY h:mm A')}
                        </Typography>
                      </Box>
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        sx={{
                          mt: 1,
                          '& .MuiButton-root': {
                            minWidth: '80px',
                            textTransform: 'none'
                          }
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(task)}
                          sx={{
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              bgcolor: 'primary.light',
                              color: 'primary.dark'
                            }
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(task._id)}
                          sx={{
                            bgcolor: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.dark'
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
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