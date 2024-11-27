import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", // Backend API URL
    timeout: 10000, // Request timeout
    withCredentials: true, // Include cookies in requests
    headers: {
        "Content-Type": "application/json", // Set JSON content type for requests
    },
});

// Interceptor for request handling
axiosInstance.interceptors.request.use(
    (config) => {
        // Add any custom logic here if needed (e.g., add additional headers)
        return config;
    },
    (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);

// Interceptor for response handling
axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful responses as is
    (error) => {
        if (error.response) {
            // Handle HTTP errors
            console.error(`Response Error (${error.response.status}):`, error.response.data);
        } else if (error.request) {
            // Handle no response from server
            console.error("No Response from Server:", error.request);
        } else {
            // Handle other errors
            console.error("Unexpected Error:", error.message);
        }
        return Promise.reject(error); // Always reject error for further handling
    }
);

export default axiosInstance;
