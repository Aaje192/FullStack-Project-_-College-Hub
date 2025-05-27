const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, forgotPassword, resetPassword, updateProfile } = require('../controllers/UserController.cjs');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;