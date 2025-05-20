const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  paper: { type: String, required: true },
  date: { type: String, required: true },
  hour: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);