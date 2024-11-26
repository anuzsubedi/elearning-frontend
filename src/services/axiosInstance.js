import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", // Replace with your backend API URL
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor for request handling
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Interceptor for response handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only reject the error, do not trigger any other actions
        return Promise.reject(error);
    }
);

export default axiosInstance;
