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
} from "@mui/material";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../api/Taskapi";

const TasksPage = () => {
  const studentId = "1234567890"; // Hardcoded studentId
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDateTime: "",
    deadline: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks(studentId);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTask(editingId, formData);
      } else {
        await addTask({ ...formData, studentId });
      }
      fetchTasks();
      setFormData({
        title: "",
        description: "",
        startDateTime: "",
        deadline: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
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
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Tasks
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? "Edit Task" : "My Task Manager"}
        </Typography>
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
            />
            <TextField
              label="Start Date and Time"
              name="startDateTime"
              type="datetime-local"
              value={formData.startDateTime}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="Deadline"
              name="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button type="submit" variant="contained" color="success">
              {editingId ? "Update Task" : "Add Task"}
            </Button>
          </Stack>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          {tasks.length === 0 ? (
            <Typography>No tasks available.</Typography>
          ) : (
            <List>
              {tasks.map((task) => (
                <React.Fragment key={task._id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {task.title}
                    </Typography>
                    <Typography variant="body2">{task.description}</Typography>
                    <Typography variant="caption">
                      Start: {new Date(task.startDateTime).toLocaleString()}
                    </Typography>
                    <Typography variant="caption">
                      Deadline: {new Date(task.deadline).toLocaleString()}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TasksPage;