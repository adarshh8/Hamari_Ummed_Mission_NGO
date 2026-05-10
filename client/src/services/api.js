import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Important for cookies/JWT if using cookies, else we use header
});

// Interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    // If you're storing token in localStorage (fallback if not using httpOnly cookies)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/admin/login'; // Redirect on unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;
