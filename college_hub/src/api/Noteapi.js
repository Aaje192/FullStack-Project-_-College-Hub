import axios from "axios";

// Get all notes for a student
export const getNotes = (studentId) =>
  axios.get(`/api/notes/${studentId}`);

// Add a text note
export const addTextNote = (note) =>
  axios.post("/api/notes/add/text", note);

// Add a file note
export const addFileNote = async (formData) => {
  try {
    console.log('Sending file upload request');
    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log('FormData entry:', key, ':', value instanceof File ? `File: ${value.name}` : value);
    }

    const response = await axios.post("/api/notes/add/file", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
      transformRequest: [(data) => data], // Prevent axios from trying to transform FormData
    });
    return response;
  } catch (error) {
    console.error('File upload error:', error.response?.data || error.message);
    throw error;
  }
};

// Download a note
export const downloadNote = (id) =>
  axios.get(`/api/notes/download/${id}`, {
    responseType: 'blob',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    },
    timeout: 30000, // 30 second timeout
    maxContentLength: 20 * 1024 * 1024, // 20MB max file size
    validateStatus: function (status) {
      return status >= 200 && status < 300; // Only accept success status codes
    }
  });

// Delete a note
export const deleteNote = (id) =>
  axios.delete(`/api/notes/delete/${id}`);