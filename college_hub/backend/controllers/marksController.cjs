// ======= controllers/marksController.js =======
const Mark = require('../models/marksModel.cjs');

exports.addMark = async (req, res) => {
  try {
    const mark = new Mark(req.body);
    const savedMark = await mark.save();
    res.status(201).json(savedMark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { filterField, filterValue } = req.query;
    
    const query = { studentId };
    if (filterField && filterValue) {
      query[filterField] = filterValue;
    }
    
    const marks = await Mark.find(query);
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ======= controllers/marksController.js =======
exports.deleteMark = async (req, res) => {
  try {
    const { markId } = req.params; // Getting markId from URL params
    const mark = await Mark.findByIdAndDelete(markId); // Deleting the mark from DB

    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }

    res.status(200).json({ message: 'Mark deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
