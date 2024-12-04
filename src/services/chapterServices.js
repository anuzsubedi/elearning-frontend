import axiosInstance from "./axiosInstance";

// Create a new chapter
export const createChapter = async (chapterData) => {
    try {
        const response = await axiosInstance.post("/chapters", chapterData);
        return { success: true, chapter_id: response.data.chapter_id };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to create chapter.",
        };
    }
};

// Get all chapters for a specific course
export const getChaptersByCourse = async (courseId) => {
    try {
        const response = await axiosInstance.get(`/chapters/course/${courseId}`);
        return { success: true, chapters: response.data }; // Directly use the array
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch chapters.",
        };
    }
};

// Get a specific chapter by its ID
export const getChapterById = async (chapterId) => {
    try {
        const response = await axiosInstance.get(`/chapters/${chapterId}`);
        return { success: true, chapter: response.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch chapter.",
        };
    }
};

// Update a chapter
export const updateChapter = async (chapterId, chapterData) => {
    try {
        const response = await axiosInstance.put(`/chapters/${chapterId}`, chapterData);
        return { success: true, message: "Chapter updated successfully!" };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update chapter.",
        };
    }
};

// Delete a chapter
export const deleteChapter = async (chapterId) => {
    try {
        await axiosInstance.delete(`/chapters/${chapterId}`);
        return { success: true, message: "Chapter deleted successfully!" };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to delete chapter.",
        };
    }
};
