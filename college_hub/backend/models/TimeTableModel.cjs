const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  day: { type: String, required: true },
  periods: [{ type: String, default: "" }]
});

module.exports = mongoose.model("Timetable", timetableSchema);