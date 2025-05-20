const express = require("express");
const router = express.Router();
const Attendance = require('../models/AttendanceModel.cjs');

// Get attendance records for a student and paper
router.get('/', async (req, res) => {
  try {
    const { paper, studentId } = req.query;
    if (!studentId) return res.status(400).json({ message: "studentId required" });
    const filter = { studentId };
    if (paper) filter.paper = paper;
    const records = await Attendance.find(filter);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Mark or update attendance for a student
router.post('/', async (req, res) => {
  try {
    const { studentId, paper, date, hour, status } = req.body;
    if (!studentId || !paper || !date || !hour || !status) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    await Attendance.findOneAndUpdate(
      { studentId, paper, date, hour },
      { status },
      { upsert: true, new: true }
    );
    res.status(201).json({ message: 'Attendance marked successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;