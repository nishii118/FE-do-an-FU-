import axios from "axios";
import { BASE_API_URL } from "../config";
import { convertFireBaseImage } from "../utils/populate";
import { convertImage } from './../utils/populate';

export const fetchListCampaignsService = async () => {
  try {
    const response = await axios.get(BASE_API_URL + "/campaigns");
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const fetchCampaignService = async (id) => {
  try {
    const response = await axios.get(BASE_API_URL + `/campaigns/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const fetchListOnGoingProjectsService = async () => {
  const params = {
    size: 12,
    status: 2,
  };
  try {
    const response = await axios.get(BASE_API_URL + "/projects/cards", {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const fetchListFinishedProjectsService = async (year) => {
  const params = {
    size: 6,
    status: 4,
    year: year,
  };
  try {
    const response = await axios.get(BASE_API_URL + "/projects/cards", {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};


export const fetchListProjectsByCampaignIdService = async (id, page) => {
  const params = {
    page: page,
    size: 1,
    status: 2
  }
  try {
    const response = await axios.get(BASE_API_URL + `/campaigns/${id}/projects`, { params });
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const fetchListDonationsByProjectIdService = async (id, params) => {
  try {
    const response = await axios.get(
      BASE_API_URL + `/projects/${id}/donation`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
}



// PROJECT DETAIL SERVICE

export const fetchProjectDetailService = async (id) => {
  try {
    const response = await axios.get(BASE_API_URL + `/projects/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const fetchListDonatationsByProjectIdService = async (id, params) => {
  try {
    const response = await axios.get(BASE_API_URL + `/projects/${id}/donations`, { params });
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};


export const fetchProjectTrackingService = async (id) => {
  try {
    const response = await axios.get(BASE_API_URL + `/projects/${id}/tracking-images`);
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const fetchProjectSponsorsService = async (id) => {
  try {
    const response = await axios.get(BASE_API_URL + `/projects/${id}/sponsors`);
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

// PROJECT LISTS PAGE SERVICE

export const fetchProjectsListService = async (params) => {
  try {
    const response = await axios.get(BASE_API_URL + "/projects/cards", {
      params,
    });
    const responseData = response.data.data.content.map((project) => ({
      ...project,
      id: project.project_id,
      location: `${project.ward}-${project.district}-${project.province}`,
      price: project.total_budget,
      goal: project.amount_needed_to_raise,
      totalDonate: project.totalDonation,
      thumbnailUrl: convertImage(project?.images?.[0]?.image),
    }));
    return { ...response.data.data, content: responseData };
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};


export const fetchCampaignsIdTitleService = async () => {
  try {
    const response = await axios.get(BASE_API_URL + "/campaigns/id-title");
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};


export const fetchStatisticsService = async () => {
  try {
    const response = await axios.get(BASE_API_URL + "/campaigns/statistics");
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};


// News Service

export const fetchNewsListService = async (params) => {
  try {
    const response = await axios.get(BASE_API_URL + "/news", {
      params,
    });
    return response.data.data
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const fetchNewsCategoriesServices = async () => {
  try {
    const response = await axios.get(BASE_API_URL + "/categories");
    return { content: response.data.data.data }
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};

export const fetchNewsDetailService = async (id) => {
  try {
    const response = await axios.get(BASE_API_URL + `/news/${id}`);
    return response.data.data
  } catch (error) {
    console.error("There was an error fetching news data!", error);
    throw error;
  }
};

// PROJECT
export const fetchProjectsIdTitleService = async () => {
  try {
    const response = await axios.get(BASE_API_URL + "/projects/by-status");
    return response.data.data;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
};