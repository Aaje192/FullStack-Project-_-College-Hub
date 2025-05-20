const Timetable = require("../models/TimeTableModel.cjs");

// Get timetable for a student
exports.getTimetable = async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ message: "studentId required" });
    const records = await Timetable.find({ studentId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// Add a new day
exports.addDay = async (req, res) => {
  try {
    const { studentId, day, periods } = req.body;
    if (!studentId || !day || !periods) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // Prevent duplicate days for the same student
    const exists = await Timetable.findOne({ studentId, day });
    if (exists) return res.status(409).json({ message: "Day already exists." });
    const newDay = new Timetable({ studentId, day, periods });
    await newDay.save();
    res.status(201).json(newDay);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// Update a period in a day
exports.updatePeriod = async (req, res) => {
  try {
    const { studentId, day, periodIdx, value } = req.body;
    const doc = await Timetable.findOne({ studentId, day });
    if (!doc) return res.status(404).json({ message: "Day not found" });
    doc.periods[periodIdx] = value;
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// Delete a day
exports.deleteDay = async (req, res) => {
  try {
    const { studentId, day } = req.params;
    await Timetable.deleteOne({ studentId, day });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};