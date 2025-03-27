import axios from "axios";
import { BASE_API_URL } from "../config";
import axiosInstance from "./api";

export const fetchListReferDonatationsService = async (userCode, params) => {
    try {
        const response = await axios.get(BASE_API_URL + `/profile-page/${userCode}/refer-donations`, { params });
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching the donations data!", error);
        throw error;
    }
};

export const fetchUserProfileService = async (userCode) => {
    try {
        const response = await axios.get(BASE_API_URL + '/profile-page/total-count-donations', {
            params: { account_code: userCode }
        })
        return response.data.data
    } catch (error) {
        console.error("There was an error fetching user data!", error);
        throw error;
    }
}


export const fetchDonatationsHistoryService = async (params) => {
    try {
        const response = await axiosInstance.get(`/profile/history-donations`, { params });
        return response.data.data;
    } catch (error) {
        console.error("There was an error fetching the donations data!", error);
        throw error;
    }
};


