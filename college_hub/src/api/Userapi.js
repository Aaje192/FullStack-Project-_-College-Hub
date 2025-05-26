import axios from "axios";

// Register a new user (student or staff)
export const registerUser = async (payload) => {
  try {
    const response = await axios.post("/api/user/register", payload);
    return response;
  } catch (error) {
    console.error('Registration API error:', error.response || error);
    throw error;
  }
};

// Login user (student or staff)
export const loginUser = async (payload) => {
  try {
    const response = await axios.post("/api/user/login", payload);
    return response;
  } catch (error) {
    console.error('Login API error:', error.response || error);
    throw error;
  }
};

// Request password reset
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post("/api/user/forgot-password", { email });
    return response;
  } catch (error) {
    console.error('Forgot password API error:', error.response || error);
    throw error;
  }
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
  try {
    console.log('Making reset password request with token:', token);
    const response = await axios.post("/api/user/reset-password", { 
      token, 
      newPassword 
    });
    console.log('Reset password response:', response);
    return response;
  } catch (error) {
    console.error('Reset password API error:', error.response || error);
    throw error;
  }
};

export const getProfile = async (id) => {
  try {
    const response = await axios.get(`/api/user/profile/${id}`);
    return response;
  } catch (error) {
    console.error('Get profile API error:', error.response || error);
    throw error;
  }
};

export const updateProfile = async (id, data) => {
  try {
    const response = await axios.put(`/api/user/profile/${id}`, data);
    return response;
  } catch (error) {
    console.error('Update profile API error:', error.response || error);
    throw error;
  }
};