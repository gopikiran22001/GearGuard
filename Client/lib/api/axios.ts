import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important: Send cookies with requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add additional headers here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - redirect to login or clear auth state
                // This will be handled by the auth context
                console.error('Unauthorized access - please login');
            } else if (status === 403) {
                console.error('Forbidden - insufficient permissions');
            } else if (status === 404) {
                console.error('Resource not found');
            } else if (status >= 500) {
                console.error('Server error - please try again later');
            }

            return Promise.reject(data || error);
        } else if (error.request) {
            // Request made but no response
            console.error('Network error - please check your connection');
            return Promise.reject({ message: 'Network error - please check your connection' });
        } else {
            // Something else happened
            console.error('Request error:', error.message);
            return Promise.reject({ message: error.message });
        }
    }
);

export default axiosInstance;
