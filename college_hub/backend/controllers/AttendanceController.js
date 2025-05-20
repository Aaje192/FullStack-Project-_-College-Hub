const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
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
};

exports.getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};