const express = require('express');
const router = express.Router();
const { getAllMessages, sendMessage } = require('../controllers/ChatForumController.cjs');

// Get all chat messages
router.get('/messages', getAllMessages);

// Send a new message
router.post('/messages', sendMessage);

module.exports = router;