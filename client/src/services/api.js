import axios from 'axios';

// API base URL - falls back to localhost if env var is missing
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
