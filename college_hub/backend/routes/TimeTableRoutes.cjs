const express = require('express');
const router = express.Router();
const controller = require('../controllers/TimetableController');

// Get all timetable data
router.get('/', controller.getTimetable);

// Update a period in a day
router.put('/period', controller.updatePeriod);

// Delete a day
router.delete('/day/:day', controller.deleteDay);

// Delete a period (column) from all days
router.put('/delete-period', controller.deletePeriod);

module.exports = router;