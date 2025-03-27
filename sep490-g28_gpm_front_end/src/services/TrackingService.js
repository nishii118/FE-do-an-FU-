import axiosInstance from "./api";

export const fetchTrackingListService = async ({ id, params }) => {
    try {
        const response = await axiosInstance.get(`admin/projects/${id}/trackings`,
            { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all tracking:', error);
        throw error;
    }
};

export const fetchTrackingDetailService = async ({ id }) => {
    try {
        const response = await axiosInstance.get(
            `admin/projects/tracking/${id}`
        );
        return response.data.data;
    } catch (error) {
        console.error("Error fetching tracking detail data:", error);
        throw error;
    }
};


export const addTrackingService = async ({ formData, id }) => {
    try {
        const response = await axiosInstance.post(
          `admin/projects/${id}/tracking/add`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.data
    } catch (error) {
        console.error("Error creating tracking:", error);
        throw error;
    }
};

export const updateTrackingService = async ({ formData, id }) => {
    try {
        const response = await axiosInstance.put(
            `/admin/projects/tracking/update/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.data
    } catch (error) {
        console.error("Error update tracking:", error);
        throw error;
    }
};

export const deleteTrackingService = async ({ trackingToDelete }) => {
    try {
        const response = await axiosInstance.delete(
            `/admin/projects/tracking/delete/${trackingToDelete}`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error delete tracking:', error);
        throw error;
    }
};