import axios from "axios";
import axiosInstance from "./api";
import { BASE_API_URL } from "../config";

export const fetchDonationListAdminService = async ({ id, params }) => {
    try {
        const response = await axiosInstance.get(
            `admin/projects/${id}/donations`,
            { params }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all donation of project:', error);
        throw error;
    }
};

export const fetchAllDonationsService = async (params) => {
    try {
        const response = await axiosInstance.get(
            `admin/donations`,
            { params }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all donations:', error);
        throw error;
    }
};


export const exportDonationFile = async (id) => {
    try {
        const response = await axios.get(BASE_API_URL + `/export/excel/${id}`, {
            responseType: 'blob', // Important to receive the file as a blob
        });
        return response;
    } catch (error) {
        console.error("Failed to export the file", error);
        throw error;
    }
};