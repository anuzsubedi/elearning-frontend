import axiosInstance from "./axiosInstance";

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage

        const response = await axiosInstance.post("/image/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, // Include the token in the request
            },
        });

        return { success: true, image_id: response.data.image_id };
    } catch (error) {
        throw new Error(error.response?.data?.message || "Image upload failed.");
    }
};
