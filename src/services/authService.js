import axios from "../api/axiosInstance";

/**
 * Handles user login API calls
 * @param {Object} credentials - The email and password
 * @returns {Promise} - The API response
 */
export const login = async (credentials) => {
    try {
        const response = await axios.post("/auth/login", credentials);
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        if (!error.response) {
            return { success: false, message: "Network error. Please check your connection." };
        }
        if (error.response.status === 401) {
            return { success: false, message: "Invalid email or password." };
        }
        return { success: false, message: "An unexpected error occurred. Please try again." };
    }
};
