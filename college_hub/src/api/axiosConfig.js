import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:4000';

// Add request interceptor for common headers
axios.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios; 