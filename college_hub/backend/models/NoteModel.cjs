const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  type: { type: String, enum: ["text", "file"], required: true },
  content: { type: String }, // For text notes
  fileData: { type: Buffer }, // For file notes
  fileMimeType: { type: String }, // For file notes
  filename: { type: String }, // For file notes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", noteSchema);