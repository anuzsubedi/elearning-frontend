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
            // Client-side error (e.g., duplicate email)
            return { success: false, message: error.response.data.message || "Invalid input or email already exists." };
        }
        if (error.response.status === 500) {
            // Server error
            return { success: false, message: "Server error. Please try again later." };
        }
        // Other errors
        return { success: false, message: `Unexpected error: ${error.response.data.message || error.code}` };
    }
};

/**
 * Checks if an email already exists in the system
 * @param {string} email - The email to check
 * @returns {Promise} - The API response
 */
export const checkEmail = async (email) => {
    try {
        const response = await axios.post("/validate/check-email", { email });
        return { exists: false, message: "Email is available" }; // Email does not exist
    } catch (error) {
        if (error.response && error.response.status === 400) {
            // Email exists
            return { exists: true, message: error.response.data.message || "Email already exists." };
        }
        if (!error.response) {
            // Network error
            return { exists: null, message: "Network error. Unable to validate email." };
        }
        // Unexpected errors
        return { exists: null, message: `Unexpected error: ${error.response.data.message || error.code}` };
    }
};