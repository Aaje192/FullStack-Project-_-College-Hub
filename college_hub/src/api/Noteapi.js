import axios from "axios";

// Get all notes for a student
export const getNotes = (studentId) =>
  axios.get(`/api/notes/${studentId}`);

// Add a text note
export const addTextNote = (note) =>
  axios.post("/api/notes/add/text", note);

// Add a file note
export const addFileNote = (formData) =>
  axios.post("/api/notes/add/file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Delete a note
export const deleteNote = (id) =>
  axios.delete(`/api/notes/delete/${id}`);