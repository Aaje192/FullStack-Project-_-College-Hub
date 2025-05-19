const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  subject: { type: String, required: true },
  examType: { type: String, required: true },
  semester: { type: String, required: true },
  mark: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Mark', marksSchema);
