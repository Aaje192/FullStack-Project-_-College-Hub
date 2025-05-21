import axios from "axios";

// Register a new user (student or staff)
export const registerUser = (payload) =>
  axios.post("/api/user/register", payload);

// Login user (student or staff)
export const loginUser = (payload) =>
  axios.post("/api/user/login", payload);