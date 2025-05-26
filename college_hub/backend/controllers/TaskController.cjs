const Task = require("../models/TaskModel.cjs");
const { sendEmail } = require("../utils/emailService.cjs");
const User = require("../models/UserModel.cjs");

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ studentId: req.params.studentId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a task
exports.addTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const saved = await newTask.save();

    // Get user's email
    const user = await User.findOne({ id: req.body.studentId });
    if (!user || !user.email) {
      console.log('User not found for ID:', req.body.studentId);
      throw new Error('User email not found');
    }

    try {
      // Send immediate confirmation email
      await sendEmail(
        user.email,
        `New Task Added: ${req.body.title}`,
        `Your task has been successfully added!\n\n` +
        `Title: ${req.body.title}\n` +
        `Description: ${req.body.description}\n` +
        `Start Time: ${new Date(req.body.startDateTime).toLocaleString()}\n` +
        `Deadline: ${new Date(req.body.deadline).toLocaleString()}\n\n` +
        `You will receive reminders:\n` +
        `- When the task starts\n` +
        `- 5 minutes before the deadline`
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't throw error here, continue with task creation
    }

    // Schedule start time notification
    const startTime = new Date(req.body.startDateTime);
    const now = new Date();
    
    // Send start time notification if start time is in the future
    if (startTime > now) {
      setTimeout(async () => {
        try {
          const task = await Task.findById(saved._id);
          if (!task || task.startReminderSent) return;

          await sendEmail(
            user.email,
            `Task Starting: ${req.body.title}`,
            `Your task "${req.body.title}" is starting now!\n\n` +
            `Description: ${req.body.description}\n` +
            `Start Time: ${startTime.toLocaleString()}\n` +
            `Deadline: ${new Date(req.body.deadline).toLocaleString()}`
          );

          // Mark start reminder as sent
          task.startReminderSent = true;
          await task.save();
        } catch (error) {
          console.error('Error sending start time email:', error);
        }
      }, startTime.getTime() - now.getTime());
    }

    // Schedule deadline reminder (5 minutes before)
    const deadlineTime = new Date(req.body.deadline);
    const reminderTime = new Date(deadlineTime.getTime() - 5 * 60000); // 5 minutes before
    
    if (reminderTime > now) {
      setTimeout(async () => {
        try {
          const task = await Task.findById(saved._id);
          if (!task || task.deadlineReminderSent) return;

          await sendEmail(
            user.email,
            `Deadline Approaching: ${req.body.title}`,
            `Your task "${req.body.title}" is due in 5 minutes!\n\n` +
            `Description: ${req.body.description}\n` +
            `Deadline: ${deadlineTime.toLocaleString()}`
          );

          // Mark deadline reminder as sent
          task.deadlineReminderSent = true;
          await task.save();
        } catch (error) {
          console.error('Error sending deadline reminder email:', error);
        }
      }, reminderTime.getTime() - now.getTime());
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error('Add task error:', err);
    res.status(400).json({ 
      message: err.message,
      details: err.stack 
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, {
      ...req.body,
      startReminderSent: false,
      deadlineReminderSent: false
    }, {
      new: true,
    });

    // Get user's email
    const user = await User.findOne({ id: task.studentId });
    if (!user || !user.email) {
      console.log('User not found for ID:', task.studentId);
      throw new Error('User email not found');
    }

    try {
      // Send immediate update confirmation
      await sendEmail(
        user.email,
        `Task Updated: ${req.body.title}`,
        `Your task has been successfully updated!\n\n` +
        `Title: ${req.body.title}\n` +
        `Description: ${req.body.description}\n` +
        `Start Time: ${new Date(req.body.startDateTime).toLocaleString()}\n` +
        `Deadline: ${new Date(req.body.deadline).toLocaleString()}\n\n` +
        `You will receive reminders:\n` +
        `- When the task starts\n` +
        `- 5 minutes before the deadline`
      );
    } catch (emailError) {
      console.error('Failed to send update confirmation email:', emailError);
      // Don't throw error here, continue with task update
    }

    // Schedule new notifications if dates have changed
    const now = new Date();
    const startTime = new Date(req.body.startDateTime);
    const deadlineTime = new Date(req.body.deadline);
    const reminderTime = new Date(deadlineTime.getTime() - 5 * 60000); // 5 minutes before

    if (startTime > now) {
      setTimeout(async () => {
        try {
          const updatedTask = await Task.findById(task._id);
          if (!updatedTask || updatedTask.startReminderSent) return;

          await sendEmail(
            user.email,
            `Task Starting: ${req.body.title}`,
            `Your task "${req.body.title}" is starting now!\n\n` +
            `Description: ${req.body.description}\n` +
            `Start Time: ${startTime.toLocaleString()}\n` +
            `Deadline: ${deadlineTime.toLocaleString()}`
          );

          updatedTask.startReminderSent = true;
          await updatedTask.save();
        } catch (error) {
          console.error('Error sending start time email:', error);
        }
      }, startTime.getTime() - now.getTime());
    }

    if (reminderTime > now) {
      setTimeout(async () => {
        try {
          const updatedTask = await Task.findById(task._id);
          if (!updatedTask || updatedTask.deadlineReminderSent) return;

          await sendEmail(
            user.email,
            `Deadline Approaching: ${req.body.title}`,
            `Your task "${req.body.title}" is due in 5 minutes!\n\n` +
            `Description: ${req.body.description}\n` +
            `Deadline: ${deadlineTime.toLocaleString()}`
          );

          updatedTask.deadlineReminderSent = true;
          await updatedTask.save();
        } catch (error) {
          console.error('Error sending deadline reminder email:', error);
        }
      }, reminderTime.getTime() - now.getTime());
    }

    res.json(task);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ 
      message: err.message,
      details: err.stack 
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};