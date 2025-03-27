import axiosInstance from "./api";

export const fetchOverviewInforService = async (params) => {
    try {
        const response = await axiosInstance.get(
            `admin/dashboard/overview`, { params }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchTotalDonationByCampaignService = async (params) => {
    try {
        const response = await axiosInstance.get(
            `admin/dashboard/pie-chart`, { params }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchTotalDonationByMonthService = async (params) => {
    try {
        const response = await axiosInstance.get(
            `admin/dashboard/total-donation/line-chart`, { params }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchTotalDonationByWeekService = async (params) => {
    try {
        const response = await axiosInstance.get(
            `admin/dashboard/total-donation/bar-chart`, { params }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};