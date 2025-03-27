import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useNavigate, useLocation } from "react-router-dom";
import { routes } from "../../../config";
import PageHeader from "../../../components/PageHeader/PageHeader";
import axiosInstance from "../../../services/api";
import { toast } from "react-toastify";

const rolesList = [
  { role_id: 1, role_name: "Admin" },
  { role_id: 2, role_name: "Project Manager" },
  { role_id: 3, role_name: "Social Staff" },
];

const UpdateAccount = () => {
  const [accountInfo, setAccountInfo] = useState({
    account_id: "",
    email: "",
    fullname: "",
    phone: "",
    address: "",
    avatar: "",
    dob: "",
    is_active: true,
    gender: false,
    role: { role_id: "", role_name: "" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAccountData = async () => {
      const account_id = location.pathname.split("/").pop();
      try {
        const response = await axiosInstance.get(
          `admin/accounts/${account_id}`
        );
        const account = response.data.data;
        setAccountInfo({
          account_id: account.account_id,
          email: account.email,
          fullname: account.fullname,
          phone: account.phone,
          address: account.address,
          avatar: account.avatar,
          dob: account.dob,
          is_active: account.is_active,
          gender: account.gender,
          role: account.role || { role_id: "", role_name: "" },
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching account data:", error);
        setLoading(false);
        setError(error);
      }
    };

    fetchAccountData();
  }, [location]);

  const handleRoleChange = (event) => {
    const { value } = event.target;
    const selectedRole = rolesList.find((role) => role.role_name === value);
    setAccountInfo((prevAccountInfo) => ({
      ...prevAccountInfo,
      role: selectedRole || { role_id: "", role_name: "" },
    }));
  };

  const handleStatusToggle = () => {
    setAccountInfo((prevAccountInfo) => ({
      ...prevAccountInfo,
      is_active: !prevAccountInfo.is_active,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedAccountInfo = {
      is_active: accountInfo.is_active,
      role: accountInfo.role,
    };

    try {
      await axiosInstance.put(
        `admin/accounts/update/${accountInfo.account_id}`,
        updatedAccountInfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Cập nhật thông tin tài khoản thành công");
      navigate("/admin/account-manage");
    } catch (error) {
      console.error(
        "There was an error updating the account!",
        error.response || error.message
      );
      setError(error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper className="w-full overflow-hidden mt-8 p-4">
        <Typography variant="h4" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">
          There was an error fetching the data: {error.message}
        </Typography>
      </Paper>
    );
  }

  return (
    <PageHeader
      breadcrumbs={[
        { title: "Dashboard", path: routes.admin },
        { title: "Quản lí tài khoản", path: routes.manageAccount },
        { title: "Cập nhật tài khoản" },
      ]}
      pageTitle={"Cập nhật tài khoản"}
    >
      <Box sx={{ maxWidth: "1000px", margin: "auto", padding: 2 }}>
        <Paper
          sx={{
            padding: 4,
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                value={accountInfo.email}
                fullWidth
                disabled
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Họ và tên"
                name="fullname"
                value={accountInfo.fullname}
                fullWidth
                disabled
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Số điện thoại"
                name="phone"
                value={accountInfo.phone}
                fullWidth
                disabled
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Ngày sinh"
                name="dob"
                type="date"
                value={accountInfo.dob}
                fullWidth
                disabled
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Địa chỉ"
                name="address"
                value={accountInfo.address}
                fullWidth
                disabled
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel shrink id="role-select-label">
                  Vai trò
                </InputLabel>
                <Select
                  label="Vai trò"
                  labelId="role-select-label"
                  id="role-select"
                  value={accountInfo.role.role_name || ""}
                  onChange={handleRoleChange}
                  fullWidth
                  size="small"
                >
                  {rolesList.map((role) => (
                    <MenuItem key={role.role_id} value={role.role_name}>
                      {role.role_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <IconButton
                color={accountInfo.is_active ? "success" : "default"}
                onClick={handleStatusToggle}
                sx={{ mt: -1 }}
                style={{ fontSize: 40 }}
              >
                {accountInfo.is_active ? (
                  <ToggleOnIcon style={{ fontSize: 40 }} />
                ) : (
                  <ToggleOffIcon style={{ fontSize: 40 }} />
                )}
              </IconButton>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Cập nhật
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/account-manage")}
            >
              Hủy bỏ
            </Button>
          </Box>
        </Paper>
      </Box>
    </PageHeader>
  );
};

export default UpdateAccount;
