import { useEffect, useState } from "react";
import { fetchListChallengeService } from "../services/ChallengeService";

const PAGE_SIZE = 8;

const useInfinityChallenges = () => {
    const [challenges, setChallenges] = useState({ data: undefined, hasMore: true });
    const [isLoading, setIsLoading] = useState(true);
    const [params, setParams] = useState({
        page: 0,
        fullname: null,
        title: null,
    });

    useEffect(() => {
        setIsLoading(true);
        fetchListChallengeService({
            page: params.page,
            size: PAGE_SIZE + 1,
            fullname: params.fullname ?? null,
            title: params.title ?? null,
        })
            .then((res) => {
                const responseData = res.content.slice(0, PAGE_SIZE + 1);
                const hasMore = res.content.length === PAGE_SIZE + 1;
                if (params.page === 0) {
                    setChallenges({ data: responseData, hasMore });
                } else {
                    setChallenges((pre) => ({
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

    return { data: challenges, isLoading, params, setParams, onLoadMore };
};

export default useInfinityChallenges;
