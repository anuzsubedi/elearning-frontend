import axiosInstance from "./axiosInstance";

export const createCourse = async (data) => {
    try {
        const response = await axiosInstance.post("/courses/create", data);
        return { success: true, message: "Course created successfully!" };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Course creation failed." };
    }
};

export const getInstructorCourses = async () => {
    try {
        const response = await axiosInstance.get("/courses/my-courses");
        console.log("Raw response:", response.data);

        // Directly return the response data if it's an array
        return {
            success: true,
            courses: Array.isArray(response.data) ? response.data : []
        };
    } catch (error) {
        console.error("Error in getInstructorCourses:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch courses."
        };
    }
}

export const getAllCourses = async () => {
    try {
        const response = await axiosInstance.get("/courses/all");
        return {
            success: true,
            courses: Array.isArray(response.data) ? response.data : []
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch courses."
        };
    }
}

export const getCourseById = async (courseId) => {
    try {
        const response = await axiosInstance.get(`/courses/${courseId}`);
        return {
            success: true,
            course: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch course."
        };
    }
}

export const editCourse = async (courseId, courseData) => {
    try {
        const response = await axiosInstance.put(`/courses/${courseId}`, courseData);

        return {
            success: true,
            course: response.data,
            message: "Course updated successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update course."
        };
    }
};