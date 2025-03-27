import { useEffect, useState } from "react";
import { fetchProjectsListService } from "../services/PublicService";

const PAGE_SIZE = 8;

const useInfinityPagination = () => {
  const [projects, setProjects] = useState({ data: undefined, hasMore: true });
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState({
    page: 0,
    title: null,
    status: null,
    year: null,
    campaign_id: null,
    minBudget: null,
    maxBudget: null,
  });

  useEffect(() => {
    setIsLoading(true);
    fetchProjectsListService({
      page: params.page,
      size: PAGE_SIZE + 1,
      title: params.title,
      status: params.status,
      year: params.year,
      campaign_id: params.campaign_id,
      minTotalBudget: params.minBudget,
      maxTotalBudget: params.maxBudget,
    })
      .then((res) => {
        const responseData = res.content.slice(0, PAGE_SIZE + 1);
        const hasMore = res.content.length === PAGE_SIZE + 1;
        if (params.page === 0) {
          setProjects({ data: responseData, hasMore });
        } else {
          setProjects((pre) => ({
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

  return { data: projects, isLoading, params, setParams, onLoadMore };
};

export default useInfinityPagination;
