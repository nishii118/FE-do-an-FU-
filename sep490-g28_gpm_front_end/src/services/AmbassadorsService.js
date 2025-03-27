import axios from "axios";
import { BASE_API_URL } from "../config";
import { convertFireBaseImage } from './../utils/populate';
import { formatDate, formatPrice } from './../utils/formart';

export const fetchTopAmbassadorsService = async (top) => {
    try {
        const response = await axios.get(BASE_API_URL + `/ambassadors/top/${top}`)
        return response.data.data
    } catch (error) {
        console.error("There was an error fetching user data!", error);
        throw error;
    }
}


export const fetchAmbassadorListService = async (params) => {
    try {
        const response = await axios.get(BASE_API_URL + "/ambassadors", {
            params,
        });
        const responseData = response.data.data.content.map((profile) => ({
            ...profile,
            id: profile.accountId,
            totalDonation: formatPrice(profile?.total_donation ?? null),
            totalChallenges: profile.total_challenges,
            avatar: convertFireBaseImage(profile?.avatar ?? null),
            createdAt: formatDate(profile.created_at ?? null)
        }));
        return { ...response.data.data, content: responseData };
    } catch (error) {
        console.error("There was an error fetching the data!", error);
        throw error;
    }
};
