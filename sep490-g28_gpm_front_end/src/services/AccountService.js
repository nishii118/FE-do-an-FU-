import axiosInstance from "./api";

export const fetchAccountsService = async (params) => {
    try {
        const response = await axiosInstance.get("admin/accounts", { params });
        return response.data.data
    } catch (error) {
        console.error("Error fetching accounts:", error);
    }
};


export const fetchAccountsIdEmailService = async () => {
    try {
        const response = await axiosInstance.get("admin/accounts/dropdown/project-managers/id-email");
        return response.data.data
    } catch (error) {
        console.error("Error fetching accounts:", error);
    }
};


export const fetchRoleService = async () => {
    try {
        const response = await axiosInstance.get("admin/role/id-name");
        return response.data.data
    } catch (error) {
        console.error("Error fetching accounts:", error);
    }
};


export const fetchSystemUserAccountsService = async (params) => {
    try {
        const response = await axiosInstance.get("admin/accounts/system-users", { params });
        return response.data.data
    } catch (error) {
        console.error("Error fetching system user:", error);
    }
};

