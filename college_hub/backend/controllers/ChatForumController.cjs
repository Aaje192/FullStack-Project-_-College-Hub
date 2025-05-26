const ChatMessage = require('../models/ChatMessageModel.cjs');
const User = require('../models/UserModel.cjs');

// Get all chat messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find()
      .sort({ timestamp: 1 }); // Sort by timestamp in ascending order
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, message } = req.body;

    // Verify sender is a registered student
    const sender = await User.findOne({ id: senderId, userType: 'student' });
    if (!sender) {
      return res.status(403).json({ message: 'Only registered students can send messages.' });
    }

    const newMessage = new ChatMessage({
      senderId,
      senderName: sender.username,
      message
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 