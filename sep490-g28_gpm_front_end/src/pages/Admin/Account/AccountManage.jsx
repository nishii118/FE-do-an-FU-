import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../config";
import PageHeader from "../../../components/PageHeader/PageHeader";
import CreateButton from "./../../../components/Button/CreateButton";
import BaseTable from "../../../components/Table/BaseTable";
import { fetchAccountsService } from "../../../services/AccountService";
import { debounce } from "lodash";
import { formatDate } from "../../../utils/formart";

const roles = [
  { value: 1, label: "Admin" },
  { value: 2, label: "Project Manager" },
  { value: 3, label: "Social Staff" },
];

const getRoleLabel = (roleId) => {
  const role = roles.find((role) => role.value === roleId);
  return role ? role.label : "N/A";
};

const AccountManage = () => {
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    isActive: "",
    role: "",
    email: "",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();

  const fetchAccounts = useCallback(async (filters, pagination) => {
    setLoading(true);
    const { page, pageSize } = pagination;
    const params = {
      page: page,
      size: pageSize,
      isActive: filters.isActive,
      roleId: filters.role,
      email: filters.email,
    };
    try {
      const response = await fetchAccountsService(params);
      const data = response.content.map((item, index) => ({
        id: item.account_id,
        index: index + 1 + pagination.page * pagination.pageSize,
        email: item.email,
        fullname: item.fullname,
        isActive: item.is_active,
        createdAt: formatDate(item.created_at),
        updatedAt: formatDate(item.updated_at),
        role: getRoleLabel(item.role.role_id),
        dob: item.dob,
      }));
      setRows(data);
      setTotalRows(response.total || 0);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
      setError(error);
    }
    setLoading(false);
  }, []);

  const debouncedFetchAccounts = useCallback(
    debounce((filters, pagination) => {
      fetchAccounts(filters, pagination);
    }, 500),
    [fetchAccounts]
  );

  useEffect(() => {
    debouncedFetchAccounts(filters, paginationModel);
  }, [filters, paginationModel, debouncedFetchAccounts]);

  const handleAddUser = () => {
    navigate("/admin/create-account");
  };

  const handleViewDetails = (accountId) => {
    const account = rows.find((row) => row.account_id === accountId);
    navigate(`/admin/update-account/${accountId}`, { state: { account } });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPaginationModel((prevModel) => ({ ...prevModel, page: 0 }));
  };

  const columns = [
    {
      field: "index",
      headerName: "STT",
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 3,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "fullname",
      headerName: "Họ và tên",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "role",
      headerName: "Vai trò",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "dob",
      headerName: "DOB",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "isActive",
      headerName: "Trạng thái",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
      renderCell: (params) => (params.value ? "Hoạt động" : "Vô hiệu hoá"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex justify-center items-center h-full">
          <Button
            color="primary"
            onClick={() => handleViewDetails(params.row.id)}
            startIcon={<Info />}
            variant="contained"
            size="small"
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <Paper className="w-full overflow-hidden mt-8 p-4">
        <Typography variant="h4" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">
          There was an error: {error.message}
        </Typography>
      </Paper>
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { title: "Dashboard", path: routes.admin },
          { title: "Quản lí tài khoản" },
        ]}
        pageTitle={"Quản lí tài khoản"}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          spacing={2}
        >
          <Grid item md={4} lg={4}>
            <CreateButton
              handleClick={handleAddUser}
              message="Tài khoản mới"
            ></CreateButton>
          </Grid>
          <Grid
            item
            md={8}
            lg={8}
            container
            justifyContent="flex-end"
            spacing={2}
          >
            <Grid item md={4} lg={4}>
              <TextField
                fullWidth
                label="Tìm theo email"
                variant="outlined"
                size="small"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item md={2} lg={3}>
              <FormControl fullWidth>
                <InputLabel size="small" id="label-active">
                  Trạng thái
                </InputLabel>
                <Select
                  labelId="label-active"
                  id="isActive"
                  name="isActive"
                  value={filters.isActive}
                  label="Trạng thái"
                  onChange={handleFilterChange}
                  size="small"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={true}>Enable</MenuItem>
                  <MenuItem value={false}>Disable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={2} lg={2.5}>
              <FormControl fullWidth>
                <InputLabel size="small" id="label-role">
                  Vai trò
                </InputLabel>
                <Select
                  labelId="label-role"
                  id="role"
                  name="role"
                  value={filters.role}
                  label="Vai trò"
                  onChange={handleFilterChange}
                  size="small"
                >
                  <MenuItem value="">All</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Box className="mt-4">
          <BaseTable
            rows={rows}
            columns={columns}
            rowCount={totalRows}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            tableLoading={loading}
          />
        </Box>
      </PageHeader>
    </div>
  );
};

export default AccountManage;
