const express = require("express");
const router = express.Router();
const multer = require("multer");
const NoteController = require("../controllers/NoteController.cjs");

const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

// Get all notes for a student
router.get("/:studentId", NoteController.getNotes);

// Add a text note
router.post("/add/text", NoteController.addNote);

// Add a file note
router.post("/add/file", upload.single("file"), NoteController.addNote);

// Download a file note
router.get("/download/:id", NoteController.downloadNote);

// Delete a note
router.delete("/delete/:id", NoteController.deleteNote);

module.exports = router;