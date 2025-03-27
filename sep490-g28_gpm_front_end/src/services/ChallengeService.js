import axios from "axios";
import axiosInstance from "./api";
import { BASE_API_URL } from "../config";


export const createChallengeService = async ({ challengeData }) => {
    const { title, goal, endDate, content, thumbnail, selectedProjects } = challengeData ?? {};
    console.log(challengeData);

    const challenge = {
        title,
        content,
        finished_at: new Date(endDate).toISOString(),
        goal: Number(goal),
        projects: selectedProjects?.map((id) => ({ project_id: id }))
    }
    const formData = new FormData();
    formData.append(
        "challenge",
        new Blob([JSON.stringify(challenge)], {
            type: "application/json",
        })
    );

    if (thumbnail) { formData.append("thumbnail", thumbnail); }


    try {
        const response = await axiosInstance.post("/manage/challenges/add", formData, {
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

export const fetchActiveChallengeService = async ({ params }) => {
    try {
        const response = await axios.get(BASE_API_URL + `/profile-page/challenges/active`, { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching active challenges:', error);
        throw error;
    }
}


export const fetchExpiredChallengeService = async ({ params }) => {
    try {
        const response = await axios.get(BASE_API_URL + `/profile-page/challenges/expired`, { params });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching expired challenges:', error);
        throw error;
    }
}

export const fetchChallengeDetailService = async (id) => {
    try {
        const response = await axios.get(BASE_API_URL + `/profile-page/challenges/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all news:', error);
        throw error;
    }
}

export const updateChallengeService = async (challengeId, challengeData) => {
    const { title, goal, endDate, content, thumbnail, initialThumbnail } = challengeData ?? {};
    console.log("data", challengeData);

    const challenge = {
        title,
        content,
        finished_at: new Date(endDate).toISOString(),
        goal: Number(goal),
        thumbnail: initialThumbnail
    }
    const formData = new FormData();
    formData.append(
        "challenge",
        new Blob([JSON.stringify(challenge)], {
            type: "application/json",
        })
    );

    if (thumbnail) { formData.append("thumbnail", thumbnail); }


    try {
        const response = await axiosInstance.put(`/manage/challenges/update/${challengeId}`, formData, {
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
export const fetchListDonatationsChallengeService = async (id, params) => {
    try {
        const response = await axios.get(BASE_API_URL + `/profile-page/challenges/${id}/donations`, { params });
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching the donations data!", error);
        throw error;
    }
};

export const fetchTopChallengesService = async (number) => {
    try {
        const response = await axios.get(BASE_API_URL + `/challenges/top/${number}`);
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching the challenges data!", error);
        throw error;
    }
}


export const fetchListChallengeService = async (params) => {
    try {
        const response = await axios.get(BASE_API_URL + `/challenges`, { params });
        const responseData = response.data.data.content.map((item) => ({
            ...item,
            createdBy: item.created_by?.fullname ?? null,
            accountCode: item.created_by?.code ?? null,
        }));
        return { ...response.data.data, content: responseData };
    } catch (error) {
        console.error("There was an error fetching the challenges data!", error);
        throw error;
    }
}

export const fetchListChallengeAdminService = async (params) => {
    try {
        const response = await axiosInstance.get(`admin/challenges`, { params });
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching the challenges data!", error);
        throw error;
    }
}