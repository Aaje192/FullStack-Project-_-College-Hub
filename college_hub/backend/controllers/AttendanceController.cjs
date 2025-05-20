const Attendance = require("../models/AttendanceModel.cjs");

// Add or update attendance
exports.markAttendance = async (req, res) => {
  try {
    const { paper, date, hour, status } = req.body;
    if (!paper || !date || !hour || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // Upsert: update if exists, else create
    const record = await Attendance.findOneAndUpdate(
      { paper, date, hour },
      { status },
      { upsert: true, new: true }
    );
    res.json({ message: "Attendance marked successfully.", record });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// Get attendance records for a paper
exports.getAttendance = async (req, res) => {
  try {
    const { paper } = req.query;
    if (!paper) return res.json([]);
    const records = await Attendance.find({ paper }).sort({ date: 1, hour: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};