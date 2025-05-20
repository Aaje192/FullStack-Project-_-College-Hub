const ChatForum = require('../models/ChatForumModel');

// Get all messages for a topic
exports.getMessages = async (req, res) => {
  try {
    const { topic } = req.query;
    const filter = topic ? { topic } : {};
    const messages = await ChatForum.find(filter);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Post a new message
exports.postMessage = async (req, res) => {
  try {
    const { topic, user, text } = req.body;
    if (!topic || !text) {
      return res.status(400).json({ message: 'Topic and message text are required.' });
    }
    const message = new ChatForum({ topic, user: user || 'Anonymous', text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Post a reply to a message
exports.postReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Reply text is required.' });
    }
    const message = await ChatForum.findById(id);
    if (!message) return res.status(404).json({ message: 'Message not found.' });
    message.replies.push({ user: user || 'Anonymous', text });
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};