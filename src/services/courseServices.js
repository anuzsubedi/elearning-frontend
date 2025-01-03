import axiosInstance from "./axiosInstance";


export const createCourse = async (data) => {
    try {
        const response = await axiosInstance.post("/courses/create", data);
        return { success: true, course_id: response.data.course_id, message: "Course created successfully!" };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to create course.",
        };
    }
};

// Other service functions...

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

export const deleteCourse = async (courseId) => {
    try {
        await axiosInstance.delete(`/courses/${courseId}`);
        return {
            success: true,
            message: "Course deleted successfully!"
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to delete course."
        };
    }
};