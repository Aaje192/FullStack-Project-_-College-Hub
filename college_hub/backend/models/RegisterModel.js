const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  year: { type: String, required: true },
  semester: { type: String, required: true },
  department: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);