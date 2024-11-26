import axiosInstance from "./axiosInstance";

// Signup function
export const signup = async (data) => {
    try {
        const response = await axiosInstance.post("/auth/signup", {
            ...data,
            user_type: "Student", // Add user_type by default
        });
        return { success: true, message: response.data.message };
    } catch (error) {
        console.error("Signup error:", error.response?.data || error.message); // Log the error for debugging
        return {
            success: false,
            message: error.response?.data?.message || "Signup failed.",
        };
    }
};

// Login function
export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post("/auth/login", credentials);
        return {
            success: true,
            user: response.data.user, // Assuming API sends user details in `response.data.user`
        };
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message); // Log the error for debugging
        return {
            success: false,
            message: error.response?.data?.message || "Login failed.",
        };
    }
};
