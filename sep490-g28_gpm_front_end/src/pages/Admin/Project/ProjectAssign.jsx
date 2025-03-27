import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  Autocomplete,
} from "@mui/material";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { routes } from "../../../config";
import { useNavigate } from "react-router-dom";
import { fetchCampaignsIdTitleService } from "../../../services/CampaignService";
import { toast } from "react-toastify";
import InfoIcon from "@mui/icons-material/Info";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { formatPrice } from "./../../../utils/formart";
import { PROJECT_STATUS } from "../../../utils/const";
import { fetchProjectsAssignSerivce } from "../../../services/ProjectService";
import BaseTable from "../../../components/Table/BaseTable";

const years = ["2024", "2023", "2022", "2021", "2020", "2019"];

const ProjectAssign = () => {
  const navigate = useNavigate();
  const [tableLoading, setTableLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRow, setTotalRow] = useState(0);
  const [filters, setFilters] = useState({
    title: null,
    year: null,
    campaign: null,
    status: null,
    province: null,
  });
  const [listCampaign, setListCampaign] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    fetchProjectData(filters);
    fetchCampaigns();
  }, [tabValue, paginationModel]);

  const fetchProjectData = async (filters) => {
    setTableLoading(true);
    try {
      const params = {
        size: paginationModel.pageSize,
        page: paginationModel.page,
        ...(tabValue && tabValue > 0 ? { status: tabValue } : {}),
        ...(filters.title && { title: filters.title }),
        ...(filters.year && { year: filters.year }),
        ...(filters.campaign && { campaign_id: filters.campaign.campaign_id }),
      };

      const response = await fetchProjectsAssignSerivce(params);
      const { content, total } = response;

      const data = content.map((item, index) => ({
        id: item.project_id,
        index: index + 1 + paginationModel.page * paginationModel.pageSize,
        title: item.title,
        campaign: item.campaign.title,
        year: new Date(item.created_at).getFullYear(),
        province: item.province,
        district: item.district,
        ward: item.ward,
        total_budget: formatPrice(item.total_budget) || 0,
        amount_needed_to_raise: formatPrice(item.amount_needed_to_raise) || 0,
        totalDonation: formatPrice(item.totalDonation) || 0,
        status: PROJECT_STATUS[item.status],
      }));

      setRows(data);
      setTotalRow(total);
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setTableLoading(false);
    }
  };
  const columns = [
    {
      field: "index",
      headerName: "STT",
      flex: 0.4,
      headerClassName: "bg-blue-500 text-white",
      filterable: false,
      cellClassName: "flex flex-col !justify-center",
    },
    {
      field: "title",
      headerName: "Dự án",
      flex: 1.5,
      headerClassName: "bg-blue-500 text-white",
      display: "flex",
      filterable: false,
      renderCell: (params) => {
        return (
          <div className="flex flex-col gap-1 py-1">
            <div>{params.row.title}</div>
            <div>Chiến dịch: {params.row.campaign}</div>
            <div>Năm: {params.row.year}</div>
          </div>
        );
      },
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      flex: 1,
      filterable: false,
      headerClassName: "bg-blue-500 text-white",
      renderCell: (params) => {
        return (
          <div className="flex flex-col gap-1 py-1">
            <div>{params.row.province}</div>
            <div>{params.row.district}</div>
            <div>{params.row.ward}</div>
          </div>
        );
      },
    },
    {
      field: "total_budget",
      headerName: "Tổng chi phí",
      flex: 0.7,
      filterable: false,
      headerClassName: "bg-blue-500 text-white",
      cellClassName: "flex flex-col !justify-center",
    },
    {
      field: "amount_needed_to_raise",
      headerName: "Cần quyên góp",
      flex: 0.7,
      filterable: false,
      headerClassName: "bg-blue-500 text-white",
      cellClassName: "flex flex-col !justify-center",
    },
    {
      field: "totalDonation",
      headerName: "Đã quyên góp được",
      flex: 0.7,
      filterable: false,
      headerClassName: "bg-blue-500 text-white",
      cellClassName: "flex flex-col !justify-center",
    },
    {
      field: "action",
      headerName: "Hành động",
      sortable: false,
      flex: 0.7,
      filterable: false,
      headerClassName: "bg-blue-500 text-white",
      headerAlign: "center",
      cellClassName: "flex flex-col !justify-center items-center",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`./${params.row.id}`)}
          size="small"
          startIcon={<InfoIcon />}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const fetchCampaigns = async () => {
    try {
      const response = await fetchCampaignsIdTitleService();
      setListCampaign(response);
    } catch (error) {
      toast.error(error);
      console.error("Error fetching campaigns:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (field, event, value) => {
    setFilters((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleFilter = () => {
    console.log("filterData", filters);
    fetchProjectData(filters);
  };

  const handleCreateClick = () => {
    navigate(routes.createProject);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <PageHeader
      breadcrumbs={[
        { id: 1, title: "Dashboard", path: routes.admin },
        { id: 2, title: "Danh sách dự án" },
      ]}
      pageTitle={"Danh sách dự án"}
    >
      <div className="w-full">
        <Grid container alignItems="center">
          <Grid
            item
            md={12}
            container
            spacing={2}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Tìm tên dự án"
                variant="outlined"
                fullWidth
                name="title"
                value={filters.title}
                onChange={handleFilterChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>Năm</InputLabel>
                <Select
                  label="Năm"
                  name="year"
                  value={filters.year || ""}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Autocomplete
                onChange={(event, value) =>
                  handleSelectChange("campaign", event, value)
                }
                id="campaign"
                options={listCampaign}
                getOptionLabel={(option) => option.title || ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={filters.campaign || null}
                size="small"
                renderInput={(params) => (
                  <TextField {...params} label="Chiến dịch" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1.5}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFilter}
                startIcon={<FilterAltIcon />}
                fullWidth
              >
                Lọc
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Box className="mt-4">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="project status tabs"
            variant="fullWidth"
            centered
          >
            <Tab label="Tất cả" sx={{ flex: 1 }} />
            <Tab label="Chưa có nhà tài trợ" sx={{ flex: 1 }} />
            <Tab label="Cần góp lẻ" sx={{ flex: 1 }} />
            <Tab label="Đang thi công" sx={{ flex: 1 }} />
            <Tab label="Hoàn thành" sx={{ flex: 1 }} />
          </Tabs>
          <Box className="w-full min-h-[500px] mt-2">
            <BaseTable
              rows={rows}
              columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              tableLoading={tableLoading}
              rowCount={totalRow}
              getRowHeight={() => "auto"}
            ></BaseTable>
          </Box>
        </Box>
      </div>
    </PageHeader>
  );
};

export default ProjectAssign;
