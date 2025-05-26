const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userType: { type: String, enum: ['student', 'staff'], required: true },
  id: { type: String, required: true, unique: true }, // studentid or staffid
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  year: { type: String },    // Only for students
  branch: { type: String },  // Only for students
  course: { type: String },  // Only for students
  mobile: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

module.exports = mongoose.model('User', userSchema);