import axiosInstance from "./axiosInstance";

export const checkEmail = async (email) => {
    try {
        const response = await axiosInstance.post("/validate/check-email", { email });
        return { exists: response.data.exists };
    } catch (error) {
        return { exists: true, message: "Email validation failed." };
    }
};
