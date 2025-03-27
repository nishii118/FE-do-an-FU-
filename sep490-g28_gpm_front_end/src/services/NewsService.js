import axiosInstance from "./api";

export const changeNewsStatusService = (body) => {
    return axiosInstance.put(`/admin/news/change-status`, body);
};

export const fetchNewsCategoryService = async () => {
    try {
        const response = await axiosInstance.get(`/categories`);
        return response.data.data.data;
    } catch (error) {
        console.error('Error fetching all campaign:', error);
        throw error;
    }
}

export const fetchListNewsCreator = async () => {
    try {
        const response = await axiosInstance.get(`/admin/accounts/news-creator`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching news creator:', error);
        throw error;
    }
};

export const createNewsService = async ({ formData }) => {
    try {
        const response = await axiosInstance
            .post("/admin/news/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        return response.data.data
    } catch (error) {
        console.error("Error creating news:", error);
        throw error;
    }
};

export const fetchNewsListService = async (params) => {
    try {
        const response = await axiosInstance.get(`/admin/news`, { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all news:', error);
        throw error;
    }
}

export const fetchStaffNewsListService = async (params) => {
    try {
        const response = await axiosInstance.get(`/admin/news/is-created`, { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all news:', error);
        throw error;
    }
}