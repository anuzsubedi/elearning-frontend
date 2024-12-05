import axiosInstance from "./axiosInstance";

// Enroll a user in a course
export const enrollUser = async (enrollmentData) => {
    try {
        const response = await axiosInstance.post("/enrollments", enrollmentData);
        return { success: true, enrollment_id: response.data.enrollment_id };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to enroll user.",
        };
    }
};

// Get all enrollments
export const getAllEnrollments = async () => {
    try {
        const response = await axiosInstance.get("/enrollments/all");
        return { success: true, enrollments: response.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch enrollments.",
        };
    }
};

// Get enrollments by user
export const getEnrollmentsByUser = async () => {
    try {
        const response = await axiosInstance.get("/enrollments/user");
        return { success: true, enrollments: response.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch user enrollments.",
        };
    }
};

// Get enrollments by course
export const getEnrollmentsByCourse = async (courseId) => {
    try {
        const response = await axiosInstance.get(`/enrollments/course/${courseId}`);
        return { success: true, enrollments: response.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch course enrollments.",
        };
    }
};

// Delete an enrollment
export const deleteEnrollment = async (enrollmentId) => {
    try {
        await axiosInstance.delete(`/enrollments/${enrollmentId}`);
        return { success: true, message: "Enrollment deleted successfully!" };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to delete enrollment.",
        };
    }
};