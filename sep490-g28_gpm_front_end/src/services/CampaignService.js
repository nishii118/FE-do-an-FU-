import axiosInstance from "./api";

export const addCampaignService = async (formData) => {
  try {
    const response = await axiosInstance.post("/admin/campaigns/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

export const updateCampaignService = async (id, formData) => {
  try {
    const response = await axiosInstance.put(
      `/admin/campaigns/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }
};

export const fetchCampaignsService = async (params) => {
  try {
    const response = await axiosInstance.get("/admin/campaigns", { params });
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const fetchCampaignDetailService = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/campaigns/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    throw error;
  }
};

export const fetchCampaignsIdTitleService = async () => {
  try {
    const response = await axiosInstance.get("/admin/campaigns/id-title");
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};
