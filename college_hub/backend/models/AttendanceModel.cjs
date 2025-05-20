const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  paper: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  hour: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true }
});

module.exports = mongoose.model("Attendance", attendanceSchema);