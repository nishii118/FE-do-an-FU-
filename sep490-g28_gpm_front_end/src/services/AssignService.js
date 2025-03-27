import axiosInstance from "./api";



export const fetchAssignListService = async ({ id, params }) => {
    try {
        const response = await axiosInstance.get(`admin/projects/${id}/members`,
            { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all assigns:', error);
        throw error;
    }
};

export const fetchAvailableMembersService = async (id) => {
    try {
        const response = await axiosInstance.get(
            `/admin/projects/${id}/members/not-assigned`
        );
        return response.data.data
    } catch (error) {
        console.error(
            "There was an error fetching the available members!",
            error
        );
    }
};

export const addAssignService = async ({ memberData, id }) => {
    try {
        const response = await axiosInstance.post(
            `/admin/projects/${id}/members/add`,
            memberData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.data
    } catch (error) {
        console.error("Error add member:", error);
        throw error;
    }
};


export const deleteAssignService = async (id) => {
    try {
        const response = await axiosInstance.delete(
            `/admin/projects/members/remove/${id}`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error deletemem ber:', error);
        throw error;
    }
};

