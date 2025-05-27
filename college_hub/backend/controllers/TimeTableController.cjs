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
    
    // Validate inputs
    if (!studentId || !day || periodIdx === undefined || periodIdx === null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find or create the timetable entry
    let doc = await Timetable.findOne({ studentId, day });
    
    if (!doc) {
      // If no entry exists, create a new one with empty periods
      const emptyPeriods = Array(8).fill("");
      emptyPeriods[periodIdx] = value; // Set the current period value
      
      doc = new Timetable({
        studentId,
        day,
        periods: emptyPeriods
      });
    } else {
      // Ensure periods array exists and has correct length
      if (!doc.periods || !Array.isArray(doc.periods)) {
        doc.periods = Array(8).fill("");
      }
      
      // Extend array if needed
      while (doc.periods.length <= periodIdx) {
        doc.periods.push("");
      }
      
      // Update the specific period
      doc.periods[periodIdx] = value;
    }

    // Save the changes
    const savedDoc = await doc.save();
    res.json(savedDoc);
  } catch (err) {
    console.error('Timetable update error:', err);
    res.status(500).json({ message: "Server error: " + err.message });
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