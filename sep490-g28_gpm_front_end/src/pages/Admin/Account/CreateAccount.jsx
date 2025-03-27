import React, { useState } from "react";
import { TextField, Button, Grid, Paper, MenuItem, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/api";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { routes } from "../../../config";
import { toast } from "react-toastify";

// Define roles and genders
const roles = [
  { value: 1, label: "Admin" },
  { value: 2, label: "Project Manager" },
  { value: 3, label: "Social Staff" },
];

const genders = [
  { value: "none", label: "Chọn giới tính" },
  { value: 0, label: "Nam" },
  { value: 1, label: "Nữ" },
];

// Define a custom theme with a color palette

const CreateAccount = () => {
  const [accountInfo, setAccountInfo] = useState({
    fullname: "",
    email: "",
    password: "",
    dob: "",
    address: "",
    phone: "",
    gender: "none",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [addressLength, setAddressLength] = useState(255);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Enforce numeric input directly for the phone field
    if (name === "phone") {
      if (!/^\d*$/.test(value)) {
        return; // Block non-numeric characters
      }
      if (value.length > 10) {
        return; // Prevent more than 10 digits
      }
    }

    if (name === "address") {
      setAddressLength(255 - value.length);
    }

    setAccountInfo({ ...accountInfo, [name]: value });
    validateField(name, value);
  };

  const handleGenderChange = (event) => {
    setAccountInfo({ ...accountInfo, gender: event.target.value });
  };

  const validateField = (name, value) => {
    let tempErrors = { ...errors };

    switch (name) {
      case "email":
        tempErrors.email = value
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? ""
            : "Email không hợp lệ."
          : "Email là bắt buộc.";
        break;
      case "password":
        tempErrors.password = value ? "" : "Mật khẩu là bắt buộc.";
        break;
      case "fullname":
        tempErrors.fullname = value ? "" : "Họ tên là bắt buộc.";
        break;
      case "role":
        tempErrors.role = value !== "" ? "" : "Vai trò là bắt buộc.";
        break;
      case "phone":
        tempErrors.phone = value
          ? /^\d{10}$/.test(value)
            ? ""
            : "Số điện thoại phải là 10 chữ số."
          : ""; // Không trả về lỗi nếu trường này rỗng
        break;
      case "address":
        tempErrors.address =
          value.length <= 255 ? "" : "Địa chỉ không được vượt quá 255 ký tự.";
        break;
      case "dob":
        tempErrors.dob =
          value === "" || new Date(value) <= new Date()
            ? ""
            : "Ngày sinh không hợp lệ.";
        break;
      default:
        break;
    }

    setErrors(tempErrors);
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = accountInfo.email
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountInfo.email)
        ? ""
        : "Email không hợp lệ."
      : "Email là bắt buộc.";
    tempErrors.password = accountInfo.password ? "" : "Mật khẩu là bắt buộc.";
    tempErrors.fullname = accountInfo.fullname ? "" : "Họ tên là bắt buộc.";
    tempErrors.role = accountInfo.role !== "" ? "" : "Vai trò là bắt buộc.";
    tempErrors.phone = accountInfo.phone
      ? /^\d{10}$/.test(accountInfo.phone)
        ? ""
        : "Số điện thoại phải là 10 chữ số."
      : ""; // Không trả về lỗi nếu trường này rỗng
    tempErrors.address =
      accountInfo.address.length <= 255
        ? ""
        : "Địa chỉ không được vượt quá 255 ký tự.";
    tempErrors.dob =
      accountInfo.dob === "" || new Date(accountInfo.dob) <= new Date()
        ? ""
        : "Ngày sinh không hợp lệ.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async () => {
    if (validate()) {
      const accountData = {
        ...accountInfo,
        gender: parseInt(accountInfo.gender), // Convert gender to integer
        role: { role_id: parseInt(accountInfo.role) }, // Convert role to an object with role_id
        is_active: true, // Assuming new accounts are active by default
      };

      try {
        const response = await axiosInstance.post(
          "/admin/accounts/create",
          accountData,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response && response.data.code === "200") {
          toast.success("Tài khoản đã được tạo mới");
          navigate("/admin/account-manage");
        } else if (response.data.code === "1005") {
          toast.error("Tài khoản tồn tại. Vui lòng sử dụng email khác.");
        } else {
          if (response.data.message) {
            toast.error(response.data.message);
          }
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.code === "1005"
        ) {
          toast.error("Email đã tồn tại. Vui lòng sử dụng email khác.");
        } else {
          toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
      }
    }
  };

  const handleCancel = () => {
    navigate("/admin/account-manage");
  };

  return (
    <PageHeader
      breadcrumbs={[
        { title: "Dashboard", path: routes.admin },
        { title: "Quản lí tài khoản", path: routes.manageAccount },
        { title: "Tạo tài khoản" },
      ]}
      pageTitle={"Tạo tài khoản"}
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
            {[
              {
                label: "Email*",
                name: "email",
                type: "email",
                xs: 12,
                md: 6,
                error: errors.email,
                helperText: errors.email,
              },
              {
                label: "Mật khẩu*",
                name: "password",
                type: "password",
                xs: 12,
                md: 6,
                error: errors.password,
                helperText: errors.password,
              },
              {
                label: "Họ và tên*",
                name: "fullname",
                type: "text",
                xs: 12,
                md: 6,
                error: errors.fullname,
                helperText: errors.fullname,
              },
              {
                label: "Vai trò*",
                name: "role",
                type: "select",
                xs: 12,
                md: 6,
                options: roles,
                error: errors.role,
                helperText: errors.role,
              },
              {
                label: "Ngày sinh",
                name: "dob",
                type: "date",
                xs: 12,
                md: 6,
                error: errors.dob,
                helperText: errors.dob,
                InputLabelProps: { shrink: true },
                inputProps: { max: new Date().toISOString().split("T")[0] }, // Set max date to today
              },
              {
                label: "Giới tính",
                name: "gender",
                type: "select",
                xs: 12,
                md: 6,
                options: genders,
              },
              {
                label: "Địa chỉ",
                name: "address",
                type: "text",
                xs: 12,
                md: 6,
                error: errors.address,
                helperText: errors.address,
                inputProps: { maxLength: 255 },
              },
              {
                label: "Số điện thoại",
                name: "phone",
                type: "text",
                xs: 12,
                md: 6,
                error: errors.phone,
                helperText: errors.phone,
                inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
              },
            ].map((field) => (
              <Grid item xs={field.xs} md={field.md} key={field.name}>
                <TextField
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={accountInfo[field.name]}
                  onChange={handleChange}
                  fullWidth
                  error={field.error}
                  helperText={field.helperText}
                  InputLabelProps={field.InputLabelProps}
                  inputProps={field.inputProps}
                  select={field.type === "select"}
                >
                  {field.type === "select" &&
                    field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <Button variant="contained" onClick={handleSubmit}>
              Tạo tài khoản
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Hủy
            </Button>
          </Box>
        </Paper>
      </Box>
    </PageHeader>
  );
};

export default CreateAccount;
