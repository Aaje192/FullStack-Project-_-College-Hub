import axios from 'axios';

const API = 'http://localhost:5174/api/marks';

// Get marks for a specific student
export const getMarks = async (studentId) => {
  const res = await axios.get(`${API}/student/${studentId}`);
  return res.data;
};

// Get all marks (optional if backend supports this)
export const getAllMarks = async () => {
  const res = await axios.get(`${API}/all`);
  return res.data;
};

// Add a new mark
export const addMark = async (markData) => {
  const res = await axios.post(API, markData);
  return res.data;
};

// Delete a mark by ID
export const deleteMark = async (markId) => {
  try {
    const response = await axios.delete(`${API}/${markId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting mark:', error);
    throw error;
  }
};
