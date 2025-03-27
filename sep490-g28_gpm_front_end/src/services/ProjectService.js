import axiosInstance from "./api";

export const fetchProjectsSerivce = async (params) => {
  try {
    const response = await axiosInstance.get("/admin/projects", { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const fetchProjectsAssignSerivce = async (params) => {
  try {
    const response = await axiosInstance.get("/admin/projects/is-assigned", { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};


export const fetchProjectDetailService = async (id) => {
  try {
    const response = await axiosInstance.get(`admin/projects/${id}`)
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const createProjectService = async (formData) => {
  try {
    const response = await axiosInstance.post('/admin/projects/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const updateProjectDetailService = async ({ formData, id }) => {

  try {
    const response = await axiosInstance.put(`admin/projects/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const updateProjectStatusService = async (id, newStatus) => {

  try {
    const response = await axiosInstance.put(`admin/projects/update/${id}/${newStatus}`)
    return response
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};