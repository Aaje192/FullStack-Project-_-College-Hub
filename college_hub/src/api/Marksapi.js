// ======= frontend/src/api/Marksapi.js =======
import axios from 'axios';
const API = 'http://localhost:5174/api/marks'

export const getMarks = async (studentId) => {
  const res = await axios.get(`${API}/student/${studentId}`);
  return res.data;
};

export const addMark = async (markData) => {
  const res = await axios.post(API, markData);
  return res.data;
};

export const deleteMark = async (markId) => {
  try {
    const response = await axios.delete(`${API}/${markId}`);  // Ensure this path matches the backend route
    return response.data;
  } catch (error) {
    console.error('Error deleting mark:', error);  // Log the error if any
    throw error;  // Optionally throw to propagate the error to the frontend component
  }
};