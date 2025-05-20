const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  day: { type: String, required: true },
  periods: [{ type: String, required: true }]
});

module.exports = mongoose.model('Timetable', timetableSchema);