const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  startDateTime: { type: Date, required: true },
  deadline: { type: Date, required: true },
  startReminderSent: { type: Boolean, default: false },
  deadlineReminderSent: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);