const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  user: { type: String, default: 'Anonymous' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ChatForumSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  user: { type: String, default: 'Anonymous' },
  text: { type: String, required: true },
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatForum', ChatForumSchema);