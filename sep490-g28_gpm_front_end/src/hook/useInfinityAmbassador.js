import { useEffect, useState } from "react";
import { fetchAmbassadorListService } from "../services/AmbassadorsService";

const PAGE_SIZE = 8;

const useInfinityAmbassador = () => {
    const [ambassadors, setAmbassadors] = useState({ data: undefined, hasMore: true });
    const [isLoading, setIsLoading] = useState(true);
    const [params, setParams] = useState({
        page: 0,
        fullname: null,
        minDonation: null,
        maxDonation: null,
    });

    useEffect(() => {
        setIsLoading(true);
        fetchAmbassadorListService({
            page: params.page,
            size: PAGE_SIZE + 1,
            fullname: params.fullname ?? null,
            minDonation: params?.minDonation ?? null,
            maxDonation: params?.maxDonation ?? null,
        })
            .then((res) => {
                const responseData = res.content.slice(0, PAGE_SIZE + 1);
                const hasMore = res.content.length === PAGE_SIZE + 1;
                if (params.page === 0) {
                    setAmbassadors({ data: responseData, hasMore });
                } else {
                    setAmbassadors((pre) => ({
                        data: [...pre.data, ...responseData],
                        hasMore,
                    }));
                }
            })
            .catch(() => { })
            .finally(() => {
                setIsLoading(false);
            });
    }, [params]);

    const onLoadMore = () => {
        setParams((preState) => {
            return {
                ...preState,
                page: preState.page + 1,
            };
        });
    };

    return { data: ambassadors, isLoading, params, setParams, onLoadMore };
};

export default useInfinityAmbassador;
