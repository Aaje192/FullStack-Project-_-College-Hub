const express = require('express');
const router = express.Router();
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/TaskController.cjs');

// Get tasks for a student
router.get('/:studentId', getTasks);

// Add a new task
router.post('/add', addTask);

// Update a task
router.put('/update/:id', updateTask);

// Delete a task
router.delete('/delete/:id', deleteTask);

module.exports = router;