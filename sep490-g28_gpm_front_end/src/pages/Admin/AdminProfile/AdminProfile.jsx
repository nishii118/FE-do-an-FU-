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
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";
import axiosInstance from "../../../services/api";
import UploadAvatar from "../../../components/FileUpload/UploadAvatar";

// Validation schema using Yup
const schema = yup.object().shape({
  oldPassword: yup.string().required("Mật khẩu cũ là bắt buộc!"),
  newPassword: yup
    .string()
    .required("Mật khẩu mới là bắt buộc!")
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự!"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu xác nhận không chính xác!")
    .required("Xác nhận mật khẩu mới là bắt buộc!"),
});

const AdminProfile = () => {
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Fetch user details from API
    axiosInstance
      .get("/profile")
      .then((response) => {
        if (response.data.code === "200") {
          setUser(response.data.data);
          setInitialUserState(response.data.data);
        }
      })
      .catch((error) => console.error(error));
  }, [isEditing]);

  const handleUpdateUser = async () => {
    // console.log(user);
    const formData = new FormData();
    formData.append(
      "profile",
      new Blob([JSON.stringify(user)], {
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
        reset();
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
        <CardContent className="flex flex-row items-start space-x-6">
          <UploadAvatar
            image={avatarFile || user.avatar}
            setImage={setAvatarFile}
            initialImage={user.avatar}
            isEditing={isEditing}
          />
          <div className="flex-1">
            <TextField
              label="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              fullWidth
              margin="normal"
              disabled
              variant="standard"
            />
            <TextField
              label="Họ và Tên"
              value={user.fullname}
              onChange={(e) => setUser({ ...user, fullname: e.target.value })}
              fullWidth
              margin="normal"
              disabled={!isEditing}
              variant="standard"
            />
            <TextField
              label="Số điện thoại"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              fullWidth
              margin="normal"
              disabled={!isEditing}
              variant="standard"
            />
            <TextField
              label="Địa chỉ"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              fullWidth
              margin="normal"
              disabled={!isEditing}
              variant="standard"
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
                control={<Radio />}
                label="Nam"
                disabled={!isEditing}
              />
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Nữ"
                disabled={!isEditing}
              />
            </RadioGroup>
            <TextField
              label="Ngày sinh"
              type="date"
              value={user.dob}
              onChange={(e) => setUser({ ...user, dob: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              disabled={!isEditing}
              variant="standard"
            />
            <div className="flex justify-between mt-4 ">
              {isEditing ? (
                <div className="flex space-x-4">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateUser}
                    disabled={isUpdating}
                    sx={{
                      borderRadius: "16px",
                      fontWeight: "bold",
                    }}
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
              >
                Đổi Mật Khẩu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle
         className="bg-blue-500 tẽ"
        >
          Đổi Mật Khẩu
        </DialogTitle>
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
        <DialogContent className="flex flex-col mb-4">
          <form onSubmit={handleSubmit(handleChangePassword)}>
            <Controller
              name="oldPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  variant="outlined"
                  label="Mật khẩu cũ"
                  type="password"
                  error={!!errors.oldPassword}
                  helperText={errors.oldPassword?.message}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  variant="outlined"
                  label="Mật khẩu mới"
                  type="password"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              name="confirmNewPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  variant="outlined"
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  error={!!errors.confirmNewPassword}
                  helperText={errors.confirmNewPassword?.message}
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

export default AdminProfile;
