const Timetable = require('../models/TimetableModel');

// Get all timetable entries
exports.getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.find();
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update a period in a day's timetable
exports.updatePeriod = async (req, res) => {
  const { day, periodIdx, value } = req.body;
  try {
    const timetable = await Timetable.findOne({ day });
    if (!timetable) return res.status(404).json({ message: 'Day not found.' });
    timetable.periods[periodIdx] = value;
    await timetable.save();
    res.json({ message: 'Period updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete a day's timetable
exports.deleteDay = async (req, res) => {
  try {
    await Timetable.deleteOne({ day: req.params.day });
    res.json({ message: 'Day deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete a period (column) from all days
exports.deletePeriod = async (req, res) => {
  const { periodIdx } = req.body;
  try {
    const timetables = await Timetable.find();
    for (const t of timetables) {
      t.periods.splice(periodIdx, 1);
      await t.save();
    }
    res.json({ message: 'Period deleted from all days.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};