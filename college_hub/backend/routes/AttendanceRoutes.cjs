const express = require('express');
const router = express.Router();
const Attendance = require('../models/AttendanceModel.cjs');

// Mark attendance (POST)
router.post('/', async (req, res) => {
  try {
    const { paper, date, hour, status } = req.body;
    if (!paper || !date || !hour || !status) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const attendance = new Attendance({ paper, date, hour, status });
    await attendance.save();
    res.status(201).json({ message: 'Attendance marked successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all attendance records (GET)
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;