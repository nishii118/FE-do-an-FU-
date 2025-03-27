import axios from "axios";
import { BASE_API_URL } from "../config";
import { formatPrice } from "../utils/formart";

export const fetchCommonAchivementService = async () => {
    try {
        const response = await axios.get(BASE_API_URL +
            `/statistics/common`
        );
        const data = response.data.data;

        const parsedData = {
            totalDonation: formatPrice(data["tong-so-quyen-gop"]) ?? 0,
            countDonation: data["tong-so-luot-quyen-gop"] ?? 0,
            totalProject: data["tong-so-du-an"] ?? 0,
            finished: data["tong-so-du-an-da-hoan-thanh"] ?? 0,
            ongoing: data["tong-so-du-an-dang-thi-cong"] ?? 0
        };

        return parsedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


export const fetchCampaignAchivementService = async (id) => {
    try {
        const response = await axios.get(BASE_API_URL +
            `/statistics/by-campaign-id/${id}`
        );
        const data = response.data.data;

        const parsedData = {
            totalDonation: formatPrice(data["tong-so-quyen-gop"]) ?? 0,
            countDonation: data["tong-so-luot-quyen-gop"] ?? 0,
            totalProject: data["tong-so-du-an"] ?? 0,
            finished: data["tong-so-du-an-da-hoan-thanh"] ?? 0,
            ongoing: data["tong-so-du-an-dang-thi-cong"] ?? 0
        };

        return parsedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};



