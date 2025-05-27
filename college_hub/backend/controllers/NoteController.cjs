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
    console.log('Add note request received:', {
      body: req.body,
      file: req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer ? 'Buffer present' : 'No buffer'
      } : 'No file',
      headers: req.headers
    });

    let noteData = {
      studentId: req.body.studentId,
      subject: req.body.subject,
      chapter: req.body.chapter,
      type: req.body.type,
    };

    if (req.body.type === "text") {
      if (!req.body.content) {
        return res.status(400).json({ message: "Content is required for text notes" });
      }
      noteData.content = req.body.content;
    } else if (req.body.type === "file") {
      if (!req.file) {
        console.log('File missing in request');
        return res.status(400).json({ message: "File upload data is missing" });
      }

      console.log('Processing file upload:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer ? 'Buffer present' : 'No buffer'
      });

      noteData.fileData = req.file.buffer;
      noteData.fileMimeType = req.file.mimetype;
      noteData.filename = req.file.originalname;

      if (!noteData.fileData) {
        console.log('File buffer is missing');
        return res.status(400).json({ message: "File data is missing" });
      }
    } else {
      return res.status(400).json({ message: "Invalid note type" });
    }

    console.log('Creating new note with data:', {
      ...noteData,
      fileData: noteData.fileData ? 'Buffer present' : 'No buffer'
    });

    const newNote = new Note(noteData);
    const saved = await newNote.save();
    console.log('Note saved successfully:', saved._id);
    
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding note:', err);
    res.status(400).json({ message: err.message });
  }
};

// Download a note
exports.downloadNote = async (req, res) => {
  try {
    console.log('Download request received:', {
      id: req.params.id,
      url: req.url,
      method: req.method
    });

    const note = await Note.findById(req.params.id);
    console.log('Note found:', {
      exists: !!note,
      type: note?.type,
      hasFile: note?.fileData ? 'yes' : 'no',
      mimeType: note?.fileMimeType
    });
    
    if (!note) {
      console.log('Note not found');
      return res.status(404).json({ message: "Note not found" });
    }
    
    if (!note.fileData) {
      console.log('File data is missing');
      return res.status(404).json({ message: "File data not found" });
    }

    // Ensure fileMimeType exists
    const mimeType = note.fileMimeType || 'application/octet-stream';
    console.log('Processing file with mime type:', mimeType);

    // For text files
    if (mimeType.includes('text') || 
        mimeType.includes('application/json') ||
        mimeType.includes('application/javascript')) {
      console.log('Sending text file content');
      const textContent = note.fileData.toString('utf-8');
      return res.json({
        content: textContent,
        mimeType: mimeType,
        filename: note.filename
      });
    }

    // For PDFs
    if (mimeType.includes('pdf')) {
      console.log('Sending PDF content as base64');
      return res.json({
        content: note.fileData.toString('base64'),
        mimeType: mimeType,
        filename: note.filename,
        isBase64: true
      });
    }

    // For images
    if (mimeType.includes('image')) {
      console.log('Sending image content as base64');
      return res.json({
        content: note.fileData.toString('base64'),
        mimeType: mimeType,
        filename: note.filename,
        isBase64: true
      });
    }

    // For other file types, send as binary download
    console.log('Sending binary file download');
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${note.filename}"`);
    return res.send(note.fileData);

  } catch (err) {
    console.error('Error in downloadNote:', {
      error: err.message,
      stack: err.stack,
      id: req.params.id
    });
    return res.status(500).json({ 
      message: "Error fetching file content",
      error: err.message 
    });
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