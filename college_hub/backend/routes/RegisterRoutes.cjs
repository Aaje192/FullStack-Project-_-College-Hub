const express = require('express');
const studentRoutes = require('../routes/RegisterRoutes');

const router = express.Router();

// All student-related APIs
router.use('/students', studentRoutes);

module.exports = router;