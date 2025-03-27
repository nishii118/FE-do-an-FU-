import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  CardHeader,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "../../../services/api";
import UploadAvatar from "../../../components/FileUpload/UploadAvatar";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";
import useUserStore from "../../../store/useUserStore";

// Validation schema for Profile Edit
const profileSchema = yup.object().shape({
  fullname: yup
    .string()
    .required("Họ và tên không được rỗng!")
    .max(150, "Họ và tên không được quá 150 ký tự!"),
  phone: yup
    .string()
    .transform((value) => (value ? value : null)) // Transform empty string to null
    .nullable()
    .matches(/^\d{10}$/, "Số điện thoại phải là chuỗi 10 số!"),
  address: yup
    .string()
    .transform((value) => (value ? value : null)) // Transform empty string to null
    .nullable()
    .max(255, "Địa chỉ không được quá 255 ký tự!"),
  dob: yup
    .date()
    .transform((value, originalValue) => (originalValue === "" ? null : value)) // Convert empty string to null
    .nullable()
    .max(new Date(), "Ngày sinh không được là ngày tương lai!"),
});

// Validation schema for Change Password
const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required("Mật khẩu cũ là bắt buộc!"),
  newPassword: yup
    .string()
    .required("Mật khẩu mới là bắt buộc!")
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự!")
    .max(15, "Mật khẩu mới tối đa là 15 ký tự!"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu xác nhận không chính xác!")
    .required("Xác nhận mật khẩu mới là bắt buộc!"),
});

const ProfileEdit = () => {
  const setAvatar = useUserStore((state) => state.setAvatar);

  const [user, setUser] = useState({
    email: "",
    fullname: "",
    phone: "",
    address: "",
    avatar: "",
    dob: "",
    gender: 1,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [initialUserState, setInitialUserState] = useState(user);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Form control for Profile Edit
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  // Form control for Change Password
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    // Fetch user details from API
    axiosInstance
      .get("/profile")
      .then((response) => {
        if (response.data.code === "200") {
          setUser(response.data.data);
          setInitialUserState(response.data.data);

          // Set initial form values manually
          setProfileValue("fullname", response.data.data.fullname);
          setProfileValue("phone", response.data.data.phone);
          setProfileValue("address", response.data.data.address);
          setProfileValue("dob", response.data.data.dob);
        }
      })
      .catch((error) => console.error(error));
  }, [isEditing, setProfileValue]);

  const handleUpdateUser = async (data) => {
    const formData = new FormData();
    formData.append(
      "profile",
      new Blob([JSON.stringify({ ...user, ...data })], {
        type: "application/json",
      })
    );
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    setIsUpdating(true);
    try {
      const response = await axiosInstance.put(
        "/profile/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code === "200") {
        toast.success(response.data.message);
        setUser(response.data.data);
        setAvatar(response.data.data?.avatar ?? null);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (data) => {
    setIsChangingPassword(true);
    try {
      const response = await axiosInstance.put("/profile/change-password", {
        old_password: data.oldPassword,
        new_password: data.newPassword,
      });

      if (response.status === 200) {
        toast.success("Mật khẩu đã được thay đổi");
        setIsPasswordDialogOpen(false);
        resetPasswordForm();
      }
    } catch (error) {
      toast.error(error.response.data.error.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelEdit = () => {
    setUser(initialUserState);
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleEditProfile = () => {
    setInitialUserState(user);
    setIsEditing(true);
  };

  return (
    <div className="flex items-center justify-center p-1 mt-2 w-full">
      <Card className="w-full max-w-5xl p-4 mb-6 !bg-white">
        <CardHeader
          title={
            <Typography variant="h6" className="!font-bold">
              THÔNG TIN CÁ NHÂN
            </Typography>
          }
        />
        <Divider />
        <CardContent className="flex lg:flex-row flex-col items-start space-x-6">
          <div className="mx-auto">
            <UploadAvatar
              image={avatarFile || user.avatar}
              setImage={setAvatarFile}
              initialImage={user.avatar}
              isEditing={isEditing}
            />
          </div>
          <div className="flex-1">
            <TextField
              label="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              fullWidth
              margin="normal"
              disabled
              variant="standard"
              required
            />
            <form onSubmit={handleProfileSubmit(handleUpdateUser)}>
              <Controller
                name="fullname"
                control={profileControl}
                defaultValue={user.fullname}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Họ và Tên"
                    fullWidth
                    margin="normal"
                    disabled={!isEditing}
                    variant="standard"
                    required
                    error={!!profileErrors.fullname}
                    helperText={profileErrors.fullname?.message}
                  />
                )}
              />
              <Controller
                name="phone"
                control={profileControl}
                defaultValue={user.phone}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Số điện thoại"
                    fullWidth
                    margin="normal"
                    disabled={!isEditing}
                    variant="standard"
                    error={!!profileErrors.phone}
                    helperText={profileErrors.phone?.message}
                  />
                )}
              />
              <Controller
                name="address"
                control={profileControl}
                defaultValue={user.address}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Địa chỉ"
                    fullWidth
                    margin="normal"
                    disabled={!isEditing}
                    variant="standard"
                    error={!!profileErrors.address}
                    helperText={profileErrors.address?.message}
                  />
                )}
              />
              <Controller
                name="dob"
                control={profileControl}
                defaultValue={user.dob}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ngày sinh"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    disabled={!isEditing}
                    variant="standard"
                    error={!!profileErrors.dob}
                    helperText={profileErrors.dob?.message}
                  />
                )}
              />
              <RadioGroup
                row
                value={user.gender}
                onChange={(e) =>
                  setUser({ ...user, gender: parseInt(e.target.value) })
                }
                className="mt-4"
              >
                <FormControlLabel
                  value={0}
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#FF5722",
                        },
                      }}
                    />
                  }
                  label="Nam"
                  disabled={!isEditing}
                />
                <FormControlLabel
                  value={1}
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#FF5722",
                        },
                      }}
                    />
                  }
                  label="Nữ"
                  disabled={!isEditing}
                />
              </RadioGroup>
              <div className="flex justify-between mt-4 gap-2 ">
                {isEditing ? (
                  <div className="flex space-x-4">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isUpdating}
                      sx={{
                        borderRadius: "16px",
                        fontWeight: "bold",
                      }}
                      className=" !bg-primary"
                    >
                      {isUpdating ? <CircularProgress size={24} /> : "Lưu"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelEdit}
                      sx={{
                        borderRadius: "16px",
                        fontWeight: "bold",
                      }}
                      className=" !border-primary !text-black"
                    >
                      Huỷ
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleEditProfile}
                    sx={{
                      borderRadius: "16px",
                      fontWeight: "bold",
                    }}
                    className="!border-primary !text-black"
                  >
                    Sửa thông tin
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsPasswordDialogOpen(true)}
                  sx={{
                    borderRadius: "16px",
                    fontWeight: "bold",
                  }}
                  className="!border-primary !text-black"
                >
                  Đổi Mật Khẩu
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      >
        <DialogTitle>Đổi Mật Khẩu</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setIsPasswordDialogOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent className="flex flex-col space-y-4 w-[500px]">
          <form onSubmit={handlePasswordSubmit(handleChangePassword)}>
            <Controller
              name="oldPassword"
              control={passwordControl}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  variant="outlined"
                  label="Mật khẩu cũ"
                  type="password"
                  error={!!passwordErrors.oldPassword}
                  helperText={passwordErrors.oldPassword?.message}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              name="newPassword"
              control={passwordControl}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  variant="outlined"
                  label="Mật khẩu mới"
                  type="password"
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword?.message}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              name="confirmNewPassword"
              control={passwordControl}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  variant="outlined"
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  error={!!passwordErrors.confirmNewPassword}
                  helperText={passwordErrors.confirmNewPassword?.message}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <DialogActions>
              <Button
                type="submit"
                disabled={isChangingPassword}
                variant="outlined"
                sx={{
                  borderRadius: "16px",
                  marginRight: "16px",
                  fontWeight: "bold",
                }}
                className="!border-primary !text-black"
              >
                {isChangingPassword ? (
                  <CircularProgress size={24} />
                ) : (
                  "Đổi Mật Khẩu"
                )}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileEdit;
