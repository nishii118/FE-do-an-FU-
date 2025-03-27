import axiosInstance from "./api";



export const fetchExpenseListService = async ({ id, params }) => {
    try {
        const response = await axiosInstance.get(`admin/projects/${id}/expenses`,
            { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all expense:', error);
        throw error;
    }
};

export const fetchExpenseDetailService = async ({id}) => {
    try {
        const response = await axiosInstance.get(
            `/admin/projects/expense/${id}`
        );
        return response.data.data;
    } catch (error) {
        console.error("Error fetching expense detail data:", error);
        throw error;
    }
};


export const addExpenseService = async ({ formData, id }) => {
    try {
        const response = await axiosInstance.post(
            `/admin/projects/${id}/expense/add`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.data
    } catch (error) {
        console.error("Error creating expense:", error);
        throw error;
    }
};

export const updateExpenseService = async ({ formData, id }) => {
    try {
        const response = await axiosInstance.put(
            `/admin/projects/expense/update/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.data
    } catch (error) {
        console.error("Error update expense:", error);
        throw error;
    }
};

export const deleteExpenseService = async ({ id }) => {
    try {
        const response = await axiosInstance.delete(
            `/admin/projects/expense/delete/${id}`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error delete expense:', error);
        throw error;
    }
};

