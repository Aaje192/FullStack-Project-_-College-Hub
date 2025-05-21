import axios from "axios";

export const getTasks = (studentId) =>
  axios.get(`/api/tasks/${studentId}`);

export const addTask = (task) =>
  axios.post("/api/tasks/add", task);

export const updateTask = (id, task) =>
  axios.put(`/api/tasks/update/${id}`, task);

export const deleteTask = (id) =>
  axios.delete(`/api/tasks/delete/${id}`);