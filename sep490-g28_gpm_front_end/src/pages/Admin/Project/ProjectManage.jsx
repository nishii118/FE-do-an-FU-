import React, { useState, useEffect, useCallback } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { routes } from "../../../config";
import { useNavigate } from "react-router-dom";
import { fetchCampaignsIdTitleService } from "../../../services/CampaignService";
import { toast } from "react-toastify";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InfoIcon from "@mui/icons-material/Info";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { formatPrice } from "./../../../utils/formart";
import { PROJECT_STATUS } from "../../../utils/const";
import {
  fetchProjectsSerivce,
  updateProjectStatusService,
} from "../../../services/ProjectService";
import BaseTable from "../../../components/Table/BaseTable";
import { isValidRole } from "../../../utils/auth";

const years = ["2024", "2023", "2022", "2021", "2020", "2019"];
const statuses = [
  { value: 1, label: "Chưa có NTT" },
  { value: 2, label: "Cần góp lẻ" },
  { value: 3, label: "Đang thi công" },
  { value: 4, label: "Hoàn thành" },
];

const ProjectManage = () => {
  const isAdmin = isValidRole("ROLE_ADMIN");
  const navigate = useNavigate();
  const [tableLoading, setTableLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRow, setTotalRow] = useState(0);
  const [filters, setFilters] = useState({
    title: "",
    year: "",
    campaign: null,
    status: "",
    province: "",
  });
  const [listCampaign, setListCampaign] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchProjectData = useCallback(
    async (filters) => {
      setTableLoading(true);
      try {
        const params = {
          size: paginationModel.pageSize,
          page: paginationModel.page,
          ...(tabValue && tabValue > 0 ? { status: tabValue } : {}),
          ...(filters.title && { title: filters.title }),
          ...(filters.year && { year: filters.year }),
          ...(filters.campaign && {
            campaign_id: filters.campaign.campaign_id,
          }),
        };

        const response = await fetchProjectsSerivce(params);
        const { content, total } = response;

        const data = content.map((item, index) => ({
          code: item.code,
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
          status: item.status,
        }));

        setRows(data);
        setTotalRow(total);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setTableLoading(false);
      }
    },
    [paginationModel.page, paginationModel.pageSize, tabValue]
  );

  useEffect(() => {
    fetchProjectData(filters);
    fetchCampaigns();
  }, [fetchProjectData]);

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
            <div>
              {params.row.code} - {params.row.title}
            </div>
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
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      filterable: false,
      headerClassName: "bg-blue-500 text-white",
      headerAlign: "center",
      cellClassName: "flex flex-col !justify-center",
      renderCell: (params) => (
        <FormControl variant="outlined" size="small" fullWidth>
          <Select
            value={params.row.status}
            onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          >
            {statuses.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "action",
      headerName: "Hành động",
      sortable: false,
      flex: 0.7,
      filterable: false,
      headerClassName: "bg-blue-500 text-white",
      headerAlign: "center",
      cellClassName: "flex flex-col !justify-center",
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
      [e.target.name]: e.target.value || "",
    });
  };

  const handleSelectChange = (field, event, value) => {
    setFilters((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleFilter = () => {
    fetchProjectData(filters);
  };

  const handleCreateClick = () => {
    navigate(routes.createProject);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPaginationModel((prevData) => ({ ...prevData, page: 0 }));
  };

  const handleStatusChange = (projectId, newStatus) => {
    console.log(projectId, newStatus);
    setSelectedProject({ projectId, newStatus });
    setOpenModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (selectedProject) {
      try {
        await updateProjectStatusService(
          selectedProject.projectId,
          selectedProject.newStatus
        );
        toast.success("Status updated successfully!");
        fetchProjectData(filters);
      } catch (error) {
        toast.error("Failed to update status.");
        console.error("Error updating status:", error);
      } finally {
        setOpenModal(false);
        setSelectedProject(null);
      }
    }
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
          <Grid item sm={12} md={3}>
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateClick}
                startIcon={<AddCircleOutlineIcon />}
                size="medium"
              >
                Dự án mới
              </Button>
            )}
          </Grid>
          <Grid
            item
            sm={12}
            md={9}
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={1.3}>
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

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn thay đổi trạng thái của dự án này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmStatusChange} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </PageHeader>
  );
};

export default ProjectManage;
