import axiosInstance from "./api";

export const createCategoryService = async ({ title, description }) => {
    try {
        const response = await axiosInstance.post("/admin/categories/add", { title, description }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

export const updateCategoryService = async (id, { title, description }) => {
    try {
        const response = await axiosInstance.put(
            `/admin/categories/update/${id}`,
            { title, description }
        );
        return response;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

export const fetchCategoryService = async () => {
    try {
        const response = await axiosInstance.get("/admin/categories");
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching the data!", error);
        throw error;
    }
};

export const fetchCategoryDetailService = async (id) => {
    try {
        const response = await axiosInstance.get(`/admin/categories/${id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching campaign data:", error);
        throw error;
    }
};

export const updateCategoryStatusService = async (id, status) => {
    try {
        const response = await axiosInstance.put(
            `/admin/categories/change-status/${id}/${status}`
        );
        return response;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};