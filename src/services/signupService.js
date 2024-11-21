import axios from "../api/axiosInstance";

/**
 * Handles user signup API calls
 * @param {Object} formData - The data to be sent in the signup request
 * @returns {Promise} - The API response
 */
export const signup = async (formData) => {
    try {
        const response = await axios.post("/auth/signup", {
            ...formData,
            user_type: "student", // Default user type
        });
        return { success: true, message: response.data.message };
    } catch (error) {
        if (!error.response) {
            // Network error
            return { success: false, message: "Network error. Please check your connection." };
        }
        if (error.response.status === 400) {
            // Duplicate email
            return { success: false, message: error.response.data.message || "Email already exists." };
        }
        if (error.response.status === 500) {
            // Server error
            return { success: false, message: "Server error. Please try again later." };
        }
        // Other errors
        return { success: false, message: `Error: ${error.response.data.message || error.code}` };
    }
};
