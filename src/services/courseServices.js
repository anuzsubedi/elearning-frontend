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