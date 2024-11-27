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

export const getImage = async (image_id) => {
    try {
        const response = await axiosInstance.get(`/image/get/${image_id}`, {
            responseType: 'arraybuffer'  // Ensure binary data is received
        });

        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageUrl = URL.createObjectURL(blob);

        return {
            success: true,
            imageUrl,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch image.",
        };
    }
};
