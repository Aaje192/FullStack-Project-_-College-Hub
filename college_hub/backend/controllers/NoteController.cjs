const fs = require("fs");
const path = require("path");
const Note = require("../models/NoteModel.cjs");

// Get all notes for a student
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ studentId: req.params.studentId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a note (text or file)
exports.addNote = async (req, res) => {
  try {
    let noteData = {
      studentId: req.body.studentId,
      subject: req.body.subject,
      chapter: req.body.chapter,
      type: req.body.type,
    };

    if (req.body.type === "text") {
      noteData.content = req.body.content;
    } else if (req.body.type === "file" && req.file) {
      noteData.fileData = req.file.buffer;
      noteData.fileMimeType = req.file.mimetype;
      noteData.filename = req.file.originalname;
    }

    const newNote = new Note(noteData);
    const saved = await newNote.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Download a file note
exports.downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !note.fileData) return res.status(404).send("File not found");
    res.set("Content-Type", note.fileMimeType);
    res.set("Content-Disposition", `attachment; filename="${note.filename}"`);
    res.send(note.fileData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};