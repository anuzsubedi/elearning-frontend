import axiosInstance from "./axiosInstance";

// Signup function
export const signup = async (data) => {
    try {
        const response = await axiosInstance.post("/auth/signup", {
            ...data,
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

        // Store the token in localStorage
        const { token, user } = response.data;
        localStorage.setItem("token", token);

        return {
            success: true,
            user,
        };
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Login failed.",
        };
    }
};
