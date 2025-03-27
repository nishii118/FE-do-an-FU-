import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../config";
import { Grid } from "@mui/material";
import PageHeader from "../../../components/PageHeader/PageHeader";
import CreateButton from "../../../components/Button/CreateButton";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import { fetchCampaignsService } from "../../../services/CampaignService";
import BaseTable from "../../../components/Table/BaseTable";
import { isValidRole } from "../../../utils/auth";
import { debounce } from "lodash";
import { formatDate } from "../../../utils/formart";

const CampaignManage = () => {
  const isAdmin = isValidRole("ROLE_ADMIN");
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    isActive: "",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const fetchCampaigns = useCallback(
    async (filters, paginationModel) => {
      setTableLoading(true);
      const { page, pageSize } = paginationModel;
      const params = {
        limit: pageSize,
        offset: page * pageSize,
        title: filters.title,
        is_active: filters.isActive,
      };
      try {
        const response = await fetchCampaignsService(params);
        const data = response.content.map((item, index) => ({
          id: item.campaign_id,
          index: index + 1 + paginationModel.page * paginationModel.pageSize,
          title: item.title,
          description: item.description,
          createdAt: formatDate(item.created_at),
          updatedAt:  formatDate(item.updated_at),
        }));
        setRows(data || []);
        setTotalRows(response.total || 0);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      } finally {
        setTableLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const debouncedFetch = debounce((filters, paginationModel) => {
      fetchCampaigns(filters, paginationModel);
    }, 500);

    debouncedFetch(filters, paginationModel);

    return () => {
      debouncedFetch.cancel();
    };
  }, [filters, paginationModel, fetchCampaigns]);

  const handleCreateClick = () => {
    navigate(routes.createCampaign);
  };

  const handleDetailsClick = (campaign_id) => {
    navigate(`/admin/manage-campaign/${campaign_id}`);
  };

  const handleEditClick = (campaign_id) => {
    navigate(`/admin/update-campaign/${campaign_id}`);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPaginationModel((prevModel) => ({ ...prevModel, page: 0 }));
  };

  const handlePaginationModelChange = (model) => {
    setPaginationModel(model);
  };

  const columns = [
    {
      field: "index",
      headerName: "STT",
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "title",
      headerName: "Tên Chiến Dịch",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "description",
      headerName: "Mô Tả",
      flex: 3,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "createdAt",
      headerName: "Ngày Tạo",
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "updatedAt",
      headerName: "Ngày Cập Nhật",
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex justify-center items-center h-full">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDetailsClick(params.row.id)}
            size="small"
            startIcon={<InfoIcon />}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { title: "Dashboard", path: routes.admin },
          { title: "Quản lí chiến dịch" },
        ]}
        pageTitle="Quản lí chiến dịch"
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          spacing={2}
        >
          <Grid item md={4} lg={4}>
            {isAdmin && (
              <CreateButton
                handleClick={handleCreateClick}
                message={"Chiến dịch mới"}
              />
            )}
          </Grid>
          <Grid
            item
            md={8}
            lg={8}
            container
            justifyContent="flex-end"
            spacing={2}
          >
            <Grid item md={4} lg={3}>
              <TextField
                label="Tìm tên Chiến Dịch"
                variant="outlined"
                size="small"
                name="title"
                value={filters.title}
                onChange={handleFilterChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Box className="mt-4">
          <BaseTable
            rows={rows}
            columns={columns}
            rowCount={totalRows}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            tableLoading={tableLoading}
          />
        </Box>
      </PageHeader>
    </div>
  );
};

export default CampaignManage;
