import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Grid,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../config";
import { NewsDataTable } from "../../../components/Table/NewsDataTable";

import PageHeader from "../../../components/PageHeader/PageHeader";
import CreateButton from "../../../components/Button/CreateButton";
import {
  fetchListNewsCreator,
  fetchNewsCategoryService,
  fetchNewsListService,
} from "../../../services/NewsService";
import { toast } from "react-toastify";
import { Search } from "@mui/icons-material";
import { isValidRole } from "../../../utils/auth";
import { ROLE } from "../../../utils/const";

const NewsManage = () => {
  const navigate = useNavigate();
  const isProjectManager = isValidRole(ROLE.projectManager);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newsData, setNewsData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [listNewsCategory, setListNewsCategory] = useState([]);
  const [listAuthor, setListAuthor] = useState([]);
  const debounceRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [params, setParams] = useState({
    title: "",
    category: "",
    author: null,
    startDate: null,
    endDate: null,
  });

  const fetchNewsData = useCallback(
    async (data) => {
      const { title, category, author, startDate, endDate } = data ?? {};
      const params = {
        ...(tabValue && tabValue > 0 ? { status: tabValue } : {}),
        title,
        category_id: category?.category_id ?? null,
        author_id: author?.account_id ?? null,
        startDate: startDate
          ? new Date(startDate).toISOString().split("T")[0]
          : null,
        endDate: endDate
          ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
              .toISOString()
              .split("T")[0]
          : null,
        page: page,
        size: rowsPerPage,
      };

      try {
        const response = await fetchNewsListService(params);
        setNewsData(response.content ?? []);
        setTotalRows(response.total ?? 0);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    },
    [page, rowsPerPage, tabValue]
  );

  const fetchListCategory = async () => {
    setLoading(true);
    try {
      const res = await fetchNewsCategoryService();
      setListNewsCategory(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi tải dữ liệu thể loại!");
    }
  };

  const fetchListAuthor = async () => {
    setLoading(true);
    try {
      const res = await fetchListNewsCreator();
      setListAuthor(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi tải dữ liệu tác giả!");
    }
  };

  useEffect(() => {
    fetchNewsData(params);
  }, [tabValue, page, rowsPerPage, fetchNewsData, params]);

  useEffect(() => {
    fetchListCategory();
    fetchListAuthor();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0); // Reset pagination when tab changes
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

  const handleChangeValue = (value, name) => {
    setParams((pre) => ({ ...pre, [name]: value }));
  };

  const handleStartDateChange = (event) => {
    const value = event.target.value;
    setStartDate(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, startDate: value }));
    }, 500);
  };

  const handleEndDateChange = (event) => {
    const value = event.target.value;
    setEndDate(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, endDate: value }));
    }, 500);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset pagination when rows per page changes
  };

  const handleCreate = () => {
    navigate(routes.createNews);
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { id: 1, title: "Dashboard", path: routes.admin },
          { id: 2, title: "Danh sách tin tức" },
        ]}
        pageTitle={"Danh sách tin tức"}
      >
        <div className="w-full">
          {!isProjectManager && (
            <Grid container className="my-5">
              <Grid item md={4} lg={4}>
                <CreateButton
                  handleClick={handleCreate}
                  message={"Bài viết mới"}
                />
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2} className="flex items-center">
            <Grid item md={6} lg={2}>
              <Autocomplete
                options={listNewsCategory}
                value={params.category || null}
                getOptionLabel={(option) => option.title || ""}
                isOptionEqualToValue={(option, value) =>
                  option.category_id === value.category_id
                }
                onChange={(event, newValue) =>
                  handleChangeValue(newValue, "category")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Phân loại" variant="outlined" />
                )}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item md={6} lg={3}>
              <Autocomplete
                options={listAuthor}
                value={params.author || null}
                getOptionLabel={(option) => option.fullname || ""}
                isOptionEqualToValue={(option, value) =>
                  option.account_id === value.account_id
                }
                onChange={(event, newValue) =>
                  handleChangeValue(newValue, "author")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Người viết"
                    variant="outlined"
                  />
                )}
                size="small"
              />
            </Grid>
            <Grid item lg={2}>
              <TextField
                label="Ngày bắt đầu"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{
                  paddingBottom: "8px",
                }}
              />
            </Grid>
            <Grid item lg={2}>
              <TextField
                label="Ngày kết thúc"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{
                  paddingBottom: "8px",
                }}
              />
            </Grid>
            <Grid item md={4} lg={3}>
              <TextField
                label="Tìm theo tiêu đề"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                className="w-full"
                InputProps={{
                  endAdornment: <Search />,
                }}
                size="small"
              />
            </Grid>
          </Grid>
          <Box>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Tất cả" className="w-1/5 border border-black" />
              <Tab label="Đang xét duyệt" className="w-1/5" />
              <Tab label="Đang hoạt động" className="w-1/5" />
              <Tab label="Đang ẩn" className="w-1/5" />
              <Tab label="Từ chối" className="w-1/5" />
            </Tabs>
            <Box mt={2}>
              {loading ? (
                <div>
                  <CircularProgress></CircularProgress>
                </div>
              ) : (
                <NewsDataTable
                  data={newsData}
                  refreshData={() => fetchNewsData(params)}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  totalRows={totalRows}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                ></NewsDataTable>
              )}
            </Box>
          </Box>
        </div>
      </PageHeader>
    </div>
  );
};

export default NewsManage;
