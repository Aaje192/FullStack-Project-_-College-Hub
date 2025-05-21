const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController.cjs");

// Add a task
router.post("/add", TaskController.addTask);

// Get all tasks for a user
router.get("/:studentId", TaskController.getTasks); // <-- changed

// Update a task
router.put("/update/:id", TaskController.updateTask);

// Delete a task
router.delete("/delete/:id", TaskController.deleteTask);

module.exports = router;