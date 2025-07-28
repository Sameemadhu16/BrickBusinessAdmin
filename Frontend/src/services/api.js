import axios from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
      // Add auth token when implemented
      return config;
    },
    (error) => {
      return Promise.reject(error);
    });

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle common errors
      if (error.response?.status === 401) {
        // Handle unauthorized
      }
      return Promise.reject(error);
    });

export default apiClient;
