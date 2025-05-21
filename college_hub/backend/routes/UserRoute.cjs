const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/UserController.cjs');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getProfile); // <-- Add this line

module.exports = router;