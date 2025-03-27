import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import { animateNumber } from "../../../utils/populate";
import { InfiniteScroll, ProjectItem } from "../../../components";
import useInfinityPagination from "../../../hook/useInfinityPagination";
import { PROJECT_STATUS_ARRAY } from "../../../utils/const";
import {
  fetchCampaignsIdTitleService,
  fetchStatisticsService,
} from "../../../services/PublicService";
import { toast } from "react-toastify";
import Finished from "../../../assets/images/finish.png";
import Ongoing from "../../../assets/images/ongoing.png";
import NeedDonate from "../../../assets/images/need-donate.png";
import { Search } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import defaultImage from "../../../assets/images/sucmanh2000.png";
const years = ["2024", "2023", "2022", "2021", "2020", "2019"];

const budgetOptions = [
  { label: "Tất cả", min: 0, max: null },
  { label: "Dưới 100 triệu", min: 0, max: 100000000 },
  { label: "100 - 200 triệu", min: 100000000, max: 200000000 },
  { label: "200 - 300 triệu", min: 200000000, max: 300000000 },
  { label: "300 - 400 triệu", min: 300000000, max: 400000000 },
  { label: "Hơn 400 triệu", min: 400000000, max: null },
];

const StatisticalCard = ({ value }) => {
  return (
    <Grid item md={3}>
      <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col items-center">
        <span>
          {value?.title}: {value?.count}
        </span>
        <div className="flex">
          <div className="flex justify-center mt-2 gap-2">
            <div>
              <Tooltip title="Dự án đã hoàn thành">
                <Button className="!rounded-full !bg-green-500 gap-2">
                  <img alt="logo" src={Finished} className="h-4 w-4"></img>
                  <span className="text-white text-xs">
                    {value?.["hoan-thanh"]}
                  </span>
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Dự án đang thi công">
                <Button className="!rounded-full !bg-yellow-500 gap-2">
                  <img alt="logo" src={Ongoing} className="h-4 w-4"></img>
                  <span className="text-white text-xs">
                    {value?.["dang-thi-cong"]}
                  </span>
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Dự án cần quyên góp">
                <Button className="!rounded-full !bg-red-500 gap-2">
                  <img alt="logo" src={NeedDonate} className="h-4 w-4"></img>
                  <span className="text-white text-xs">
                    {value?.["can-quyen-gop"]}
                  </span>
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Dự án chưa có NTT">
                <Button className="!rounded-full !bg-gray-500 gap-2">
                  <img alt="logo" src={NeedDonate} className="h-4 w-4"></img>
                  <span className="text-white text-xs">
                    {value?.["chua-co-ntt"]}
                  </span>
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
};

const Projects = () => {
  const debounceRef = useRef(null);
  const [campaigns, setCampaigns] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const fetchCampaignIdTitle = async () => {
    try {
      const response = await fetchCampaignsIdTitleService();
      setCampaigns(response);
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi load dữ liệu chiến dịch");
    }
  };

  const fetchStatistic = async () => {
    try {
      const response = await fetchStatisticsService();
      setStatistics(response.data);
      setTotal(response.total);
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi load dữ liệu thống kê");
    }
  };

  useEffect(() => {
    fetchStatistic();
    fetchCampaignIdTitle();
  }, []);

  const {
    data: projects,
    params,
    isLoading,
    setParams,
    onLoadMore,
  } = useInfinityPagination();

  const handleCampaignChange = (event, value) => {
    if (value) {
      setParams({ ...params, campaign_id: value.campaign_id, page: 0 });
    } else {
      const { campaign_id, ...rest } = params;
      setParams({ ...rest, page: 0 });
    }
  };

  const handleYearChange = (event, value) => {
    if (value) {
      setParams({ ...params, year: value, page: 0 });
    } else {
      const { year, ...rest } = params;
      setParams({ ...rest, page: 0 });
    }
  };

  const handleStatusChange = (event, value) => {
    if (value) {
      setParams({ ...params, status: value.id, page: 0 });
    } else {
      const { status, ...rest } = params;
      setParams({ ...rest, page: 0 });
    }
  };

  const handleBudgetChange = (event, value) => {
    if (value) {
      setParams({
        ...params,
        minBudget: value.min,
        maxBudget: value.max,
        page: 0,
      });
    } else {
      const { minBudget, maxBudget, ...rest } = params;
      setParams({ ...rest, page: 0 });
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, title: value }));
    }, 500);
  };

  return (
    <div className="container mx-auto py-10 flex flex-col gap-10">
      <Helmet>
        <title>Dự án Sức mạnh 2000</title>
        <meta
          name="description"
          content="Dự án Sức mạnh 2000 đã và đang thực hiện, nhằm giúp đỡ những hoàn cảnh khó khăn, trẻ em vùng cao."
        />

        <meta property="og:title" content="Dự án Sức mạnh 2000" />
        <meta
          property="og:description"
          content="Dự án Sức mạnh 2000 đã và đang thực hiện, nhằm giúp đỡ những hoàn cảnh khó khăn, trẻ em vùng cao."
        />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content="https://fpt.sucmanh2000.com/du-an" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="bg-[#f2f2f2] p-8 rounded-lg flex flex-col items-center gap-4">
        <span className="text-2xl font-bold text-red-600">Thống kê nhanh</span>
        <span className="text-xl">
          Tổng dự án:{" "}
          <span id="value" className="text-2xl font-bold text-red-600">
            {/* {animateNumber(145, 50, animateNumberFnc)} */}
            {total ? total : 0}
          </span>
        </span>
        <Grid container spacing={2} justifyContent={"center"}>
          {statistics.map((stat) => (
            <StatisticalCard key={stat.title} value={stat} />
          ))}
        </Grid>
      </div>
      <div>
        <Grid container justifyContent="center" gap={1}>
          <Grid item xs={6} lg={2}>
            <Autocomplete
              onChange={handleCampaignChange}
              options={campaigns}
              getOptionLabel={(option) => option.title || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              size="small"
              disablePortal
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField size="small" {...params} fullWidth label="Loại dự án" />
              )}
            />
          </Grid>
          <Grid item xs={6} lg={2}>
            <Autocomplete
              size="small"
              disablePortal
              options={years}
              onChange={handleYearChange}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField size="small" {...params} fullWidth label="Năm" />
              )}
            />
          </Grid>
          <Grid item xs={6}  lg={2}>
            <Autocomplete
              size="small"
              disablePortal
              options={PROJECT_STATUS_ARRAY}
              getOptionLabel={(option) => option.title}
              onChange={handleStatusChange}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField size="small" {...params} fullWidth label="Tiến độ" />
              )}
            />
          </Grid>
          <Grid item xs={6} lg={2}>
            <Autocomplete
              size="small"
              disablePortal
              options={budgetOptions}
              getOptionLabel={(option) => option.label}
              onChange={handleBudgetChange}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField size="small" {...params} fullWidth label="Khoảng tiền" />
              )}
            />
          </Grid>
          <Grid item xs={6} lg={3}>
            <TextField
              label="Tên dự án"
              variant="outlined"
              value={search}
              onChange={handleSearchChange}
              fullWidth
              className="w-full"
              InputProps={{
                endAdornment: <Search />,
              }}
              size="small"
            />
          </Grid>
        </Grid>
      </div>

      {projects.data ? (
        <InfiniteScroll
          loader={
            <div>
              <CircularProgress />
            </div>
          }
          fetchMore={onLoadMore}
          hasMore={projects.hasMore}
        >
          <div>
            {projects.data.length ? (
              <Grid container spacing={2} className="mt-2">
                {projects.data.map((item) => (
                  <Grid item xs={12} md={4} key={item.course_id}>
                    <ProjectItem data={item} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <div className="border-2 border-gray-200 h-[200px] flex justify-center items-center mt-4 rounded-xl">
                Không tìm thấy dự án
              </div>
            )}
          </div>
        </InfiniteScroll>
      ) : (
        <div>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Projects;
