import axiosInstance from "./axiosInstance";

// Get course details by student ID
export const getCourseByStudentId = async (courseId) => {
    try {
        const response = await axiosInstance.get(`/student-courses/${courseId}`);
        return { success: true, course: response.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch course details.",
        };
    }
};