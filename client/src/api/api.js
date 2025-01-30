import axios from "axios";

// Create an instance of axios
const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:5000/api/v1",
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json", // Default content type
    Accept: "application/json", // Default Accept header
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Example: Add Authorization token if available
    const token = localStorage.getItem("token"); // Or use a cookie for Next.js SSR
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Process the response data if needed
    // return response.data;
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // Server responded with a status other than 200
      console.error("Response error:", error.response);
    } else if (error.request) {
      // No response received
      console.error("Request error:", error.request);
    } else {
      // Something happened setting up the request
      console.error("Axios error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
