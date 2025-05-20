const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');

router.post('/', AttendanceController.markAttendance);
router.get('/', AttendanceController.getAttendance);

module.exports = router;