const express = require('express');
const router = express.Router();
const { registerStudent } = require('../controllers/studentController');

// POST /api/students/register
router.post('/register', registerStudent);

module.exports = router;