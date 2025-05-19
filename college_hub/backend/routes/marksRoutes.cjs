// ======= routes/marksRoutes.js =======
const express = require('express');
const router = express.Router();
const { addMark, getMarks, deleteMark } = require('../controllers/marksController.cjs');

router.post('/', addMark);
router.get('/student/:studentId', getMarks);
router.delete('/:markId', deleteMark);

module.exports = router; // ✅ This line is required
