import axiosInstance from "./api";



export const fetchSponsorListService = async ({ id, params }) => {
    try {
        const response = await axiosInstance.get(
            `admin/projects/${id}/sponsors`,
            { params }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all sponsors:', error);
        throw error;
    }
};

export const fetchSponsorDetailService = async ({ id }) => {
    try {
        const response = await axiosInstance.get(
            `/admin/projects/sponsors/${id}`
        );
        return response.data.data;
    } catch (error) {
        console.error("Error fetching sponsor detail data:", error);
        throw error;
    }
};


export const addSponsorService = async ({ formData, id }) => {
    try {
        const response = await axiosInstance.post(
            `admin/projects/${id}/sponsors/add`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
        );
        return response.data.data
    } catch (error) {
        console.error("Error creating sponsor:", error);
        throw error;
    }
};

export const updateSponsorService = async ({ formData, id }) => {
    try {
        const response = await axiosInstance.put(
            `/admin/projects/sponsor/update/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.data
    } catch (error) {
        console.error("Error update sponsor:", error);
        throw error;
    }
};

export const deleteSponsorService = async ({ sponsorToDelete }) => {
    try {
        const response = await axiosInstance.delete(
            `admin/projects/sponsors/delete/${sponsorToDelete}`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error delete sponsor:', error);
        throw error;
    }
};

